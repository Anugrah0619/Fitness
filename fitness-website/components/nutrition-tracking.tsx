"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Utensils, Apple } from "lucide-react"
import { format, addDays, subDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { auth, db } from "@/firebase-config"
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore"

// Food database (simplified)
const foodDatabase = [
  { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice (100g, cooked)", calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: "Egg", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Broccoli (100g)", calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
  { name: "Greek Yogurt (100g)", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Avocado (half)", calories: 161, protein: 2, carbs: 8.5, fat: 15 },
  { name: "Oatmeal (100g, cooked)", calories: 71, protein: 2.5, carbs: 12, fat: 1.5 },
  { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Whole Wheat Bread (slice)", calories: 81, protein: 4, carbs: 15, fat: 1.1 },
  { name: "Milk (250ml)", calories: 122, protein: 8.2, carbs: 11.7, fat: 4.8 },
  { name: "Peanut Butter (tbsp)", calories: 94, protein: 4, carbs: 3, fat: 8 },
  { name: "Spinach (100g)", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
]

export default function NutritionTracking() {
  // ---- State for Daily View ----
  const [view, setView] = useState("daily")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [meals, setMeals] = useState<any[]>([])
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 70,
  })
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  const [loading, setLoading] = useState(true)

  // ---- State for Weekly View ----
  const [weeklyLoading, setWeeklyLoading] = useState(false)
  const [weeklyTotals, setWeeklyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  // ---- State for Add Meal Dialog ----
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [newMeal, setNewMeal] = useState({
    name: "Breakfast",
    time: format(new Date().setHours(8, 0), "HH:mm"),
    items: [] as any[],
  })

  // ---- State for Add Food Dialog ----
  const [addFoodOpen, setAddFoodOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState("")
  const [foodQuantity, setFoodQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // ------------------------------------------------------------------
  // 1. Fetch daily goals & today's meals on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const fetchNutritionData = async () => {
      try {
        // Fetch user's nutrition goals
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists() && userDoc.data().nutritionGoals) {
          setDailyGoals(userDoc.data().nutritionGoals)
        } else {
          // Set default goals if not found & update Firestore
          await updateDoc(userDocRef, {
            nutritionGoals: dailyGoals,
          })
        }

        // Fetch meals for the selected date
        await fetchMealsForDate(selectedDate)
      } catch (error) {
        console.error("Error fetching nutrition data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNutritionData()
  }, [])

  // ------------------------------------------------------------------
  // 2. Recalculate daily totals when meals change
  // ------------------------------------------------------------------
  useEffect(() => {
    calculateDailyTotals()
  }, [meals])

  // ------------------------------------------------------------------
  // 3. Refetch daily meals if selectedDate changes
  // ------------------------------------------------------------------
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return
    fetchMealsForDate(selectedDate)
  }, [selectedDate])

  // ------------------------------------------------------------------
  // 4. Functions for daily data
  // ------------------------------------------------------------------
  const fetchMealsForDate = async (date: Date) => {
    const user = auth.currentUser
    if (!user) return

    setLoading(true)

    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const mealsRef = collection(db, "meals")
      const q = query(
        mealsRef,
        where("userId", "==", user.uid),
        where("date", ">=", Timestamp.fromDate(startOfDay)),
        where("date", "<=", Timestamp.fromDate(endOfDay))
      )

      const querySnapshot = await getDocs(q)
      const fetchedMeals: any[] = []

      querySnapshot.forEach((docSnap) => {
        fetchedMeals.push({
          id: docSnap.id,
          ...docSnap.data(),
          date: docSnap.data().date?.toDate() || new Date(),
        })
      })

      // Sort meals by time
      fetchedMeals.sort((a, b) => {
        const timeA = a.time.split(":").map(Number)
        const timeB = b.time.split(":").map(Number)
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
      })

      setMeals(fetchedMeals)
    } catch (error) {
      console.error("Error fetching meals:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDailyTotals = () => {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }

    meals.forEach((meal) => {
      meal.items.forEach((item: any) => {
        totals.calories += item.calories * item.quantity
        totals.protein += item.protein * item.quantity
        totals.carbs += item.carbs * item.quantity
        totals.fat += item.fat * item.quantity
      })
    })

    setDailyTotals(totals)
  }

  // ------------------------------------------------------------------
  // 5. Weekly View logic
  // ------------------------------------------------------------------
  const fetchWeeklyData = async () => {
    const user = auth.currentUser
    if (!user) return

    setWeeklyLoading(true)
    try {
      // Calculate the date range (last 7 days)
      const today = new Date()
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)

      const mealsRef = collection(db, "meals")
      const q = query(
        mealsRef,
        where("userId", "==", user.uid),
        where("date", ">=", Timestamp.fromDate(weekAgo)),
        where("date", "<=", Timestamp.fromDate(today))
      )

      const querySnapshot = await getDocs(q)
      const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

      querySnapshot.forEach((docSnap) => {
        const mealData = docSnap.data()
        if (mealData.items && Array.isArray(mealData.items)) {
          mealData.items.forEach((item: any) => {
            totals.calories += item.calories * item.quantity
            totals.protein += item.protein * item.quantity
            totals.carbs += item.carbs * item.quantity
            totals.fat += item.fat * item.quantity
          })
        }
      })

      setWeeklyTotals(totals)
    } catch (error) {
      console.error("Error fetching weekly data:", error)
    } finally {
      setWeeklyLoading(false)
    }
  }

  // Optionally, fetch weekly data as soon as you switch to "weekly" tab
  // or you can fetch it on mount. It's up to you.
  useEffect(() => {
    if (view === "weekly") {
      fetchWeeklyData()
    }
  }, [view])

  // ------------------------------------------------------------------
  // 6. Date Navigation
  // ------------------------------------------------------------------
  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => subDays(prevDate, 1))
  }

  const handleNextDay = () => {
    setSelectedDate((prevDate) => addDays(prevDate, 1))
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  // ------------------------------------------------------------------
  // 7. Add Meal & Add Food logic
  // ------------------------------------------------------------------
  const handleAddMeal = async () => {
    const user = auth.currentUser
    if (!user) return

    try {
      const mealDate = new Date(selectedDate)
      const [hours, minutes] = newMeal.time.split(":").map(Number)
      mealDate.setHours(hours, minutes, 0, 0)

      const mealData = {
        userId: user.uid,
        name: newMeal.name,
        time: newMeal.time,
        date: Timestamp.fromDate(mealDate),
        items: newMeal.items,
        createdAt: Timestamp.now(),
      }

      await addDoc(collection(db, "meals"), mealData)

      // Reset form and close dialog
      setNewMeal({
        name: "Breakfast",
        time: format(new Date().setHours(8, 0), "HH:mm"),
        items: [],
      })
      setAddMealOpen(false)

      // Refresh meals
      await fetchMealsForDate(selectedDate)
    } catch (error) {
      console.error("Error adding meal:", error)
    }
  }

  const handleAddFoodToMeal = () => {
    const food = foodDatabase.find((f) => f.name === selectedFood)
    if (!food) return

    const newItem = {
      ...food,
      quantity: foodQuantity,
    }

    setNewMeal((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))

    // Reset form and close dialog
    setSelectedFood("")
    setFoodQuantity(1)
    setAddFoodOpen(false)
  }

  const handleRemoveFoodFromMeal = (index: number) => {
    setNewMeal((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteDoc(doc(db, "meals", mealId))
      await fetchMealsForDate(selectedDate)
    } catch (error) {
      console.error("Error deleting meal:", error)
    }
  }

  // Filter food items based on search
  const filteredFoods = searchTerm
    ? foodDatabase.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : foodDatabase

  // ------------------------------------------------------------------
  // 8. Render
  // ------------------------------------------------------------------
  if (loading && meals.length === 0) {
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
          <h2 className="text-2xl font-bold">Nutrition Tracking</h2>
          <p className="text-muted-foreground">Monitor your daily nutrition intake</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={() => setAddMealOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Meal
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="meals">Meal Plans</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousDay}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextDay}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* -------------------- DAILY VIEW -------------------- */}
        <TabsContent value="daily" className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{format(selectedDate, "PPPP")}</h3>
          </div>

          {/* Daily Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(dailyTotals.calories)} / {dailyGoals.calories}
                </div>
                <Progress
                  value={Math.min((dailyTotals.calories / dailyGoals.calories) * 100, 100)}
                  className="h-2 mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((dailyTotals.calories / dailyGoals.calories) * 100)}% of daily goal
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(dailyTotals.protein)}g / {dailyGoals.protein}g
                </div>
                <Progress
                  value={Math.min((dailyTotals.protein / dailyGoals.protein) * 100, 100)}
                  className="h-2 mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((dailyTotals.protein / dailyGoals.protein) * 100)}% of daily goal
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(dailyTotals.carbs)}g / {dailyGoals.carbs}g
                </div>
                <Progress
                  value={Math.min((dailyTotals.carbs / dailyGoals.carbs) * 100, 100)}
                  className="h-2 mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((dailyTotals.carbs / dailyGoals.carbs) * 100)}% of daily goal
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(dailyTotals.fat)}g / {dailyGoals.fat}g
                </div>
                <Progress
                  value={Math.min((dailyTotals.fat / dailyGoals.fat) * 100, 100)}
                  className="h-2 mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((dailyTotals.fat / dailyGoals.fat) * 100)}% of daily goal
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meals List */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
              <CardDescription>Your food intake for {format(selectedDate, "PPP")}</CardDescription>
            </CardHeader>
            <CardContent>
              {meals.length > 0 ? (
                <div className="space-y-4">
                  {meals.map((meal) => {
                    // Calculate meal totals
                    const mealTotals = meal.items.reduce(
                      (acc: any, item: any) => ({
                        calories: acc.calories + item.calories * item.quantity,
                        protein: acc.protein + item.protein * item.quantity,
                        carbs: acc.carbs + item.carbs * item.quantity,
                        fat: acc.fat + item.fat * item.quantity,
                      }),
                      { calories: 0, protein: 0, carbs: 0, fat: 0 }
                    )

                    return (
                      <div key={meal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-medium">{meal.name}</h3>
                            <p className="text-sm text-muted-foreground">{meal.time}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{Math.round(mealTotals.calories)} cal</div>
                            <div className="text-sm text-muted-foreground">
                              P: {Math.round(mealTotals.protein)}g • C: {Math.round(mealTotals.carbs)}g • F:{" "}
                              {Math.round(mealTotals.fat)}g
                            </div>
                          </div>
                        </div>

                        {meal.items.length > 0 ? (
                          <div className="space-y-1 mt-3">
                            {meal.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.name} {item.quantity > 1 ? `(${item.quantity}x)` : ""}
                                </span>
                                <span>{Math.round(item.calories * item.quantity)} cal</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground mt-3">No items added to this meal</div>
                        )}

                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Meals Logged</h3>
                  <p className="text-muted-foreground mb-4">
                    Start tracking your nutrition by adding meals for this day
                  </p>
                  <Button onClick={() => setAddMealOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Your First Meal
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setAddMealOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Meal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* -------------------- WEEKLY VIEW -------------------- */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Nutrition Overview</CardTitle>
              <CardDescription>Your nutrition trends for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This data covers the last 7 days (from 7 days ago to today).
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold">Weekly Totals</h3>
                      <p>Total Calories: {Math.round(weeklyTotals.calories)}</p>
                      <p>Total Protein: {Math.round(weeklyTotals.protein)}g</p>
                      <p>Total Carbs: {Math.round(weeklyTotals.carbs)}g</p>
                      <p>Total Fat: {Math.round(weeklyTotals.fat)}g</p>
                    </div>
                    {/* You could replace this with a chart library like Recharts or Chart.js */}
                    <Button onClick={fetchWeeklyData}>Refresh Weekly Data</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- MEAL PLANS VIEW -------------------- */}
        <TabsContent value="meals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Meal Plans</CardTitle>
              <CardDescription>Your custom and recommended meal plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">High Protein Plan</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    2,400 calories • 180g protein • 220g carbs • 80g fat
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Use Today</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Weight Loss Plan</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    1,800 calories • 150g protein • 150g carbs • 60g fat
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Use Today</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Maintenance Plan</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    2,200 calories • 150g protein • 220g carbs • 70g fat
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button size="sm">Use Today</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 border-dashed flex items-center justify-center">
                  <Button variant="ghost">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Meal Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* -------------------- ADD MEAL DIALOG -------------------- */}
      <Dialog open={addMealOpen} onOpenChange={setAddMealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
            <DialogDescription>Log your meal for {format(selectedDate, "PPP")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal-name" className="text-right">
                Meal
              </Label>
              <Select
                value={newMeal.name}
                onValueChange={(value) => setNewMeal((prev) => ({ ...prev, name: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Morning Snack">Morning Snack</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Afternoon Snack">Afternoon Snack</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                  <SelectItem value="Evening Snack">Evening Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal-time" className="text-right">
                Time
              </Label>
              <Input
                id="meal-time"
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal((prev) => ({ ...prev, time: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Foods</Label>
              <div className="col-span-3 space-y-2">
                {newMeal.items.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {newMeal.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.calories * item.quantity} cal • P: {item.protein * item.quantity}g • C:{" "}
                            {item.carbs * item.quantity}g • F: {item.fat * item.quantity}g
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{item.quantity}x</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFoodFromMeal(index)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md border-dashed">
                    <Apple className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No foods added yet</p>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full" onClick={() => setAddFoodOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMealOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMeal} disabled={newMeal.items.length === 0}>
              Save Meal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------- ADD FOOD DIALOG -------------------- */}
      <Dialog open={addFoodOpen} onOpenChange={setAddFoodOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Food</DialogTitle>
            <DialogDescription>Search for a food to add to your meal</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="food-search">Search Food</Label>
              <Input
                id="food-search"
                placeholder="Search for a food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="h-60 overflow-y-auto border rounded-md p-2">
              {filteredFoods.length > 0 ? (
                <div className="space-y-2">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.name}
                      className={`p-2 rounded-md cursor-pointer hover:bg-muted ${
                        selectedFood === food.name ? "bg-muted border-primary border" : ""
                      }`}
                      onClick={() => setSelectedFood(food.name)}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No foods found</p>
                </div>
              )}
            </div>

            {selectedFood && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="food-quantity" className="text-right">
                  Quantity
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFoodQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={foodQuantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="food-quantity"
                    type="number"
                    min="1"
                    value={foodQuantity}
                    onChange={(e) => setFoodQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" size="sm" onClick={() => setFoodQuantity((prev) => prev + 1)}>
                    +
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFoodOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFoodToMeal} disabled={!selectedFood}>
              Add Food
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
