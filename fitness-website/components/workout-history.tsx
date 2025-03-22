"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Filter, Search, Dumbbell } from "lucide-react"
import Link from "next/link"
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { auth, db, rtdb } from "@/firebase-config"
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore"
import { ref, onValue } from "firebase/database"

export default function WorkoutHistory() {
  const [view, setView] = useState("list")
  const [workoutType, setWorkoutType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([])
  const [workoutStats, setWorkoutStats] = useState<any>({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    correctPostures: 0,
    incorrectPostures: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    // Fetch workout history from Firestore
    const fetchWorkoutHistory = async () => {
      try {
        const workoutsRef = collection(db, "workouts")
        const q = query(workoutsRef, where("userId", "==", user.uid), orderBy("date", "desc"), limit(20))

        const querySnapshot = await getDocs(q)
        const workouts: any[] = []

        querySnapshot.forEach((doc) => {
          workouts.push({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date(),
          })
        })

        setWorkoutHistory(workouts)
      } catch (error) {
        console.error("Error fetching workout history:", error)
      } finally {
        setLoading(false)
      }
    }

    // Listen to real-time workout stats from Realtime Database
    const workoutStatsRef = ref(rtdb, `workoutStats/${user.uid}`)
    const unsubscribe = onValue(workoutStatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setWorkoutStats({
          totalWorkouts: data.totalSessions || 0,
          totalDuration: data.totalDuration || 0,
          totalCalories: data.totalCaloriesBurned || 0,
          correctPostures: data.correctPostures || 0,
          incorrectPostures: data.incorrectPostures || 0,
        })
      }
    })

    fetchWorkoutHistory()

    return () => {
      // Clean up the listener
      unsubscribe()
    }
  }, [])

  // Filter workouts based on search term and workout type
  const filteredWorkouts = workoutHistory.filter((workout) => {
    const matchesSearch = searchTerm === "" || workout.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = workoutType === "all" || workout.type.toLowerCase() === workoutType.toLowerCase()

    return matchesSearch && matchesType
  })

  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 7))
  }

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 7))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Generate days for calendar view
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Get workouts for each day in the week
  const getWorkoutsForDay = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return workoutHistory.filter((workout) => format(new Date(workout.date), "yyyy-MM-dd") === dateString)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Workout History</h2>
          <p className="text-muted-foreground">Track your fitness journey</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workouts..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workouts</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Workouts</CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {filteredWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{workout.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(workout.date), "PPP")} • {workout.duration} min • {workout.calories}{" "}
                            calories
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{workout.type}</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/workouts/${workout.workoutId}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No workout history found</p>
                  <Button asChild>
                    <Link href="/workouts">Start a Workout</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Workout Calendar</CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Week of {format(weekStart, "MMM d, yyyy")} - {format(weekEnd, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="border rounded-lg p-2">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium">{format(day, "EEE")}</div>
                      <div
                        className={`text-lg ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {getWorkoutsForDay(day).map((workout, idx) => (
                        <div key={idx} className="text-xs p-1 bg-primary/10 rounded truncate" title={workout.name}>
                          {workout.name}
                        </div>
                      ))}

                      {getWorkoutsForDay(day).length === 0 && (
                        <div className="text-xs text-muted-foreground text-center py-1">No workouts</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{workoutStats.totalWorkouts}</div>
                <div className="text-xs text-muted-foreground">All time</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(workoutStats.totalDuration / 60)} hrs {workoutStats.totalDuration % 60} mins
                </div>
                <div className="text-xs text-muted-foreground">All time</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{workoutStats.totalCalories}</div>
                <div className="text-xs text-muted-foreground">All time</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Workout Distribution</CardTitle>
              <CardDescription>Breakdown by workout type</CardDescription>
            </CardHeader>
            <CardContent>
              {workoutHistory.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                    {["Strength", "Cardio", "HIIT", "Flexibility"].map((type) => {
                      const count = workoutHistory.filter((w) => w.type.toLowerCase() === type.toLowerCase()).length
                      const percentage =
                        workoutHistory.length > 0 ? Math.round((count / workoutHistory.length) * 100) : 0

                      return (
                        <div key={type} className="text-center">
                          <div
                            className={`h-${Math.max(8, 8 + percentage / 5)} bg-primary/80 rounded-md mb-2`}
                            style={{
                              opacity: 0.2 + (percentage / 100) * 0.8,
                              height: `${Math.max(20, 20 + percentage)}px`,
                            }}
                          ></div>
                          <div className="text-sm">{type}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Posture Analysis</h3>
                    <div className="flex items-center justify-between">
                      <span>Correct Postures</span>
                      <span className="font-medium">{workoutStats.correctPostures}</span>
                    </div>
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            workoutStats.correctPostures + workoutStats.incorrectPostures > 0
                              ? (
                                  workoutStats.correctPostures /
                                    (workoutStats.correctPostures + workoutStats.incorrectPostures)
                                ) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Incorrect Postures</span>
                      <span className="font-medium">{workoutStats.incorrectPostures}</span>
                    </div>
                    <div className="h-2 bg-destructive/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive"
                        style={{
                          width: `${
                            workoutStats.correctPostures + workoutStats.incorrectPostures > 0
                              ? (
                                  workoutStats.incorrectPostures /
                                    (workoutStats.correctPostures + workoutStats.incorrectPostures)
                                ) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 border rounded-md">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Workout Data Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete workouts to see your statistics and distribution
                  </p>
                  <Button asChild>
                    <Link href="/workouts">Start a Workout</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

