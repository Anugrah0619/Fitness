"use client"

import { useState, useEffect } from "react"
import { Activity, Calendar, TrendingUp, Award, Clock, BarChart3, Flame, Dumbbell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { auth, db, rtdb } from "@/firebase-config"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, onValue } from "firebase/database"
import { useRouter } from "next/navigation"

export default function ProfileDashboard() {
  const [userData, setUserData] = useState<any>({
    displayName: "",
    workoutsCompleted: 0,
    caloriesBurned: 0,
    streak: 0,
    weeklyGoal: 5,
    calorieGoal: 2500,
    weightLoss: 0,
  })

  const [workoutStats, setWorkoutStats] = useState<any>({
    correctPostures: 0,
    incorrectPostures: 0,
    totalSessions: 0,
    lastWorkout: null,
  })

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch user profile data from Firestore
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUserData({
            displayName: user.displayName || "User",
            ...userDoc.data(),
          })
        } else {
          // Create a new user document if it doesn't exist
          const newUserData = {
            displayName: user.displayName || "User",
            email: user.email,
            workoutsCompleted: 0,
            caloriesBurned: 0,
            streak: 0,
            weeklyGoal: 5,
            calorieGoal: 2500,
            weightLoss: 0,
            createdAt: new Date(),
          }

          await setDoc(userDocRef, newUserData)
          setUserData(newUserData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    // Listen to real-time workout stats from Realtime Database
    const workoutStatsRef = ref(rtdb, `workoutStats/${user.uid}`)
    const unsubscribe = onValue(workoutStatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setWorkoutStats(data)
      }
      setLoading(false)
    })

    fetchUserData()

    return () => {
      // Clean up the listener
      unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {userData.displayName}!</CardTitle>
            <CardDescription>Here's your health summary for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {userData.workoutsCompleted} of {userData.weeklyGoal}
                </div>
                <div className="text-sm text-muted-foreground">Weekly workouts completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.streak} days</div>
                <div className="text-sm text-muted-foreground">Current streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {userData.weightLoss > 0 ? `${userData.weightLoss} kg` : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Weight loss this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.caloriesBurned}</div>
            <div className="text-xs text-muted-foreground">This week</div>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${Math.min((userData.caloriesBurned / userData.calorieGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posture Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workoutStats.totalSessions > 0
                ? `${Math.round((workoutStats.correctPostures / (workoutStats.correctPostures + workoutStats.incorrectPostures)) * 100)}%`
                : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">Correct posture rate</div>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full"
                style={{
                  width:
                    workoutStats.totalSessions > 0
                      ? `${Math.round((workoutStats.correctPostures / (workoutStats.correctPostures + workoutStats.incorrectPostures)) * 100)}%`
                      : "0%",
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
          <CardDescription>Your progress towards this week's targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  <span>Complete {userData.weeklyGoal} workouts</span>
                </div>
                <span className="text-sm font-medium">
                  {userData.workoutsCompleted}/{userData.weeklyGoal}
                </span>
              </div>
              <Progress
                value={(userData.workoutsCompleted / userData.weeklyGoal) * 100}
                className="bg-gray-200 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  <span>Burn {userData.calorieGoal} calories</span>
                </div>
                <span className="text-sm font-medium">
                  {userData.caloriesBurned}/{userData.calorieGoal}
                </span>
              </div>
              <Progress
                value={(userData.caloriesBurned / userData.calorieGoal) * 100}
                className="bg-gray-200 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  <span>Maintain correct posture</span>
                </div>
                <span className="text-sm font-medium">
                  {workoutStats.totalSessions > 0
                    ? `${workoutStats.correctPostures}/${workoutStats.correctPostures + workoutStats.incorrectPostures}`
                    : "N/A"}
                </span>
              </div>
              <Progress
                value={
                  workoutStats.totalSessions > 0
                    ? (workoutStats.correctPostures / (workoutStats.correctPostures + workoutStats.incorrectPostures)) *
                      100
                    : 0
                }
                className="bg-gray-200 dark:bg-gray-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Upcoming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest workouts and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {workoutStats.totalSessions > 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Last Workout Session</div>
                    <div className="text-sm text-muted-foreground">
                      {workoutStats.lastWorkout ? new Date(workoutStats.lastWorkout).toLocaleString() : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Calories Burned</div>
                    <div className="text-sm text-muted-foreground">
                      {workoutStats.lastSessionCalories || 0} calories in last session
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Posture Quality</div>
                    <div className="text-sm text-muted-foreground">
                      {workoutStats.lastSessionCorrectPostures || 0} correct postures in last session
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">No workout sessions recorded yet</div>
                <Button onClick={() => router.push("/workouts")}>Start Your First Workout</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Personalized suggestions based on your activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutStats.totalSessions > 0 ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Workout Suggestion</div>
                      <div className="text-sm text-muted-foreground">
                        {workoutStats.correctPostures > workoutStats.incorrectPostures
                          ? "Try increasing workout intensity for better results"
                          : "Focus on improving your form during exercises"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Progress Check</div>
                      <div className="text-sm text-muted-foreground">
                        {userData.streak >= 3
                          ? "Great job maintaining your streak! Keep it up!"
                          : "Try to work out consistently to build a streak"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Get Started</div>
                    <div className="text-sm text-muted-foreground">
                      Complete your first workout to receive personalized recommendations
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Weekly Report</div>
                  <div className="text-sm text-muted-foreground">
                    Your weekly progress report will be available on Sunday
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

