"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftCircle, Clock, Utensils, BarChart, Flame, Apple } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock meal plan details data
const mealPlanDetails = {
  1: {
    title: "High Protein Meal Plan",
    category: "Muscle Building",
    difficulty: "Intermediate",
    prepTime: "30 min",
    calories: "2500",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Omnivore",
    description:
      "A high-protein meal plan designed to support muscle growth and recovery. Perfect for those looking to build lean muscle mass while maintaining a balanced diet.",
    meals: [
      {
        name: "Breakfast",
        time: "7:30 AM",
        items: [
          {
            name: "Protein Oatmeal",
            description: "Rolled oats with whey protein, banana, and almond butter",
            calories: 450,
            protein: 30,
            carbs: 45,
            fat: 15,
          },
          {
            name: "Greek Yogurt",
            description: "With berries and a drizzle of honey",
            calories: 180,
            protein: 18,
            carbs: 15,
            fat: 5,
          },
          { name: "Black Coffee", description: "Unsweetened", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
      },
      {
        name: "Mid-Morning Snack",
        time: "10:30 AM",
        items: [
          {
            name: "Protein Shake",
            description: "Whey protein with almond milk and a banana",
            calories: 250,
            protein: 25,
            carbs: 20,
            fat: 5,
          },
          { name: "Handful of Almonds", description: "Raw, unsalted", calories: 160, protein: 6, carbs: 6, fat: 14 },
        ],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        items: [
          {
            name: "Grilled Chicken Breast",
            description: "Seasoned with herbs and spices",
            calories: 200,
            protein: 38,
            carbs: 0,
            fat: 4,
          },
          { name: "Brown Rice", description: "1 cup cooked", calories: 220, protein: 5, carbs: 45, fat: 2 },
          {
            name: "Steamed Vegetables",
            description: "Broccoli, carrots, and bell peppers",
            calories: 80,
            protein: 4,
            carbs: 15,
            fat: 0,
          },
          { name: "Olive Oil Dressing", description: "1 tablespoon", calories: 120, protein: 0, carbs: 0, fat: 14 },
        ],
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        items: [
          {
            name: "Cottage Cheese",
            description: "With pineapple chunks",
            calories: 180,
            protein: 25,
            carbs: 10,
            fat: 5,
          },
          { name: "Whole Grain Crackers", description: "5-6 crackers", calories: 120, protein: 3, carbs: 20, fat: 3 },
        ],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        items: [
          {
            name: "Grilled Salmon",
            description: "6 oz fillet with lemon and herbs",
            calories: 350,
            protein: 34,
            carbs: 0,
            fat: 22,
          },
          { name: "Sweet Potato", description: "Medium, baked", calories: 180, protein: 4, carbs: 40, fat: 0 },
          {
            name: "Mixed Green Salad",
            description: "With cherry tomatoes and cucumber",
            calories: 50,
            protein: 2,
            carbs: 10,
            fat: 0,
          },
          { name: "Balsamic Vinaigrette", description: "1 tablespoon", calories: 50, protein: 0, carbs: 4, fat: 3 },
        ],
      },
      {
        name: "Evening Snack",
        time: "9:30 PM",
        items: [
          {
            name: "Casein Protein Shake",
            description: "Slow-digesting protein for overnight recovery",
            calories: 120,
            protein: 24,
            carbs: 3,
            fat: 1,
          },
          {
            name: "Natural Peanut Butter",
            description: "1 tablespoon on celery sticks",
            calories: 100,
            protein: 4,
            carbs: 3,
            fat: 8,
          },
        ],
      },
    ],
    nutritionSummary: {
      calories: 2500,
      protein: 220,
      carbs: 240,
      fat: 80,
    },
    tips: [
      "Drink at least 3-4 liters of water throughout the day",
      "Time your protein intake around your workouts for optimal muscle recovery",
      "Adjust portion sizes based on your specific caloric needs",
      "Consider taking a multivitamin to ensure you're getting all necessary micronutrients",
      "For best results, follow this meal plan alongside a structured strength training program",
    ],
  },
  2: {
    title: "Vegetarian Weight Loss",
    category: "Weight Loss",
    difficulty: "Beginner",
    prepTime: "20 min",
    calories: "1800",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Vegetarian",
    description:
      "A balanced vegetarian meal plan designed for sustainable weight loss. Rich in plant proteins, fiber, and essential nutrients to keep you satisfied while in a caloric deficit.",
    meals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          {
            name: "Vegetable Omelette",
            description: "Made with 2 eggs, spinach, tomatoes, and onions",
            calories: 220,
            protein: 14,
            carbs: 6,
            fat: 16,
          },
          {
            name: "Whole Grain Toast",
            description: "1 slice with avocado spread",
            calories: 150,
            protein: 4,
            carbs: 15,
            fat: 8,
          },
          { name: "Herbal Tea", description: "Unsweetened", calories: 0, protein: 0, carbs: 0, fat: 0 },
        ],
      },
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          {
            name: "Greek Yogurt",
            description: "Plain, low-fat with berries",
            calories: 150,
            protein: 15,
            carbs: 12,
            fat: 3,
          },
        ],
      },
      {
        name: "Lunch",
        time: "12:30 PM",
        items: [
          {
            name: "Quinoa Bowl",
            description: "With roasted vegetables and chickpeas",
            calories: 350,
            protein: 12,
            carbs: 45,
            fat: 10,
          },
          {
            name: "Mixed Green Salad",
            description: "With lemon-olive oil dressing",
            calories: 80,
            protein: 2,
            carbs: 8,
            fat: 5,
          },
        ],
      },
      {
        name: "Afternoon Snack",
        time: "3:30 PM",
        items: [
          {
            name: "Hummus",
            description: "1/4 cup with carrot and cucumber sticks",
            calories: 150,
            protein: 6,
            carbs: 15,
            fat: 8,
          },
        ],
      },
      {
        name: "Dinner",
        time: "6:30 PM",
        items: [
          {
            name: "Lentil Soup",
            description: "Homemade with vegetables",
            calories: 250,
            protein: 15,
            carbs: 30,
            fat: 5,
          },
          {
            name: "Tofu Stir-Fry",
            description: "With broccoli, bell peppers, and brown rice",
            calories: 300,
            protein: 15,
            carbs: 35,
            fat: 10,
          },
        ],
      },
      {
        name: "Evening Snack",
        time: "8:30 PM",
        items: [
          {
            name: "Cottage Cheese",
            description: "Low-fat with cinnamon and a small apple",
            calories: 150,
            protein: 20,
            carbs: 15,
            fat: 2,
          },
        ],
      },
    ],
    nutritionSummary: {
      calories: 1800,
      protein: 103,
      carbs: 181,
      fat: 67,
    },
    tips: [
      "Focus on eating slowly and mindfully to recognize fullness cues",
      "Stay hydrated with water, herbal teas, and infused water throughout the day",
      "Include regular physical activity - aim for 30 minutes daily",
      "Meal prep in advance to avoid reaching for less healthy options when hungry",
      "Adjust portion sizes based on your specific caloric needs and activity level",
    ],
  },
  3: {
    title: "Keto Meal Plan",
    category: "Weight Loss",
    difficulty: "Advanced",
    prepTime: "40 min",
    calories: "2000",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Keto",
    description:
      "A ketogenic meal plan designed to help your body enter and maintain ketosis. High in healthy fats, moderate in protein, and very low in carbohydrates.",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        items: [
          {
            name: "Avocado Baked Eggs",
            description: "2 eggs baked in avocado halves with bacon bits",
            calories: 400,
            protein: 18,
            carbs: 8,
            fat: 35,
          },
          {
            name: "Bulletproof Coffee",
            description: "Coffee with grass-fed butter and MCT oil",
            calories: 230,
            protein: 0,
            carbs: 0,
            fat: 25,
          },
        ],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        items: [
          {
            name: "Keto Cobb Salad",
            description: "With grilled chicken, bacon, avocado, blue cheese, and olive oil dressing",
            calories: 550,
            protein: 35,
            carbs: 6,
            fat: 42,
          },
        ],
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        items: [
          { name: "Macadamia Nuts", description: "1 ounce", calories: 200, protein: 2, carbs: 4, fat: 22 },
          { name: "String Cheese", description: "1 stick", calories: 80, protein: 7, carbs: 1, fat: 6 },
        ],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        items: [
          {
            name: "Grilled Salmon",
            description: "6 oz with herb butter",
            calories: 400,
            protein: 34,
            carbs: 0,
            fat: 30,
          },
          {
            name: "Cauliflower Rice",
            description: "With garlic and herbs",
            calories: 80,
            protein: 2,
            carbs: 8,
            fat: 5,
          },
          {
            name: "Sautéed Spinach",
            description: "In olive oil with garlic",
            calories: 100,
            protein: 3,
            carbs: 3,
            fat: 8,
          },
        ],
      },
    ],
    nutritionSummary: {
      calories: 2040,
      protein: 101,
      carbs: 30,
      fat: 173,
    },
    tips: [
      "Track your macros carefully to maintain ketosis (typically 70-75% fat, 20-25% protein, 5-10% carbs)",
      "Stay hydrated and consider adding electrolytes to prevent 'keto flu'",
      "Eat plenty of non-starchy vegetables to ensure adequate fiber intake",
      "Consider intermittent fasting to enhance ketosis",
      "Monitor your ketone levels if you're new to the keto diet",
    ],
  },
  4: {
    title: "Vegan Performance",
    category: "Performance",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2200",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Vegan",
    description:
      "A plant-based meal plan designed for athletic performance and recovery. Rich in plant proteins, complex carbohydrates, and anti-inflammatory foods to fuel your workouts and aid recovery.",
    meals: [
      {
        name: "Breakfast",
        time: "7:00 AM",
        items: [
          {
            name: "Protein-Packed Smoothie Bowl",
            description: "With plant protein, banana, berries, spinach, and almond milk",
            calories: 350,
            protein: 25,
            carbs: 45,
            fat: 8,
          },
          {
            name: "Whole Grain Toast",
            description: "With almond butter",
            calories: 200,
            protein: 8,
            carbs: 20,
            fat: 12,
          },
        ],
      },
      {
        name: "Mid-Morning Snack",
        time: "10:00 AM",
        items: [
          {
            name: "Energy Balls",
            description: "Made with dates, nuts, and plant protein",
            calories: 200,
            protein: 8,
            carbs: 20,
            fat: 10,
          },
        ],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        items: [
          {
            name: "Lentil and Quinoa Bowl",
            description: "With roasted vegetables and tahini dressing",
            calories: 450,
            protein: 20,
            carbs: 60,
            fat: 15,
          },
          {
            name: "Green Juice",
            description: "Kale, cucumber, apple, and ginger",
            calories: 100,
            protein: 2,
            carbs: 25,
            fat: 0,
          },
        ],
      },
      {
        name: "Pre-Workout Snack",
        time: "4:00 PM",
        items: [
          { name: "Banana", description: "With 2 tbsp peanut butter", calories: 200, protein: 8, carbs: 25, fat: 8 },
        ],
      },
      {
        name: "Post-Workout",
        time: "6:30 PM",
        items: [
          {
            name: "Plant Protein Shake",
            description: "With almond milk and a date",
            calories: 200,
            protein: 25,
            carbs: 15,
            fat: 5,
          },
        ],
      },
      {
        name: "Dinner",
        time: "7:30 PM",
        items: [
          {
            name: "Tofu Stir-Fry",
            description: "With brown rice and mixed vegetables",
            calories: 400,
            protein: 20,
            carbs: 50,
            fat: 12,
          },
          { name: "Sweet Potato", description: "Baked with cinnamon", calories: 150, protein: 2, carbs: 35, fat: 0 },
        ],
      },
    ],
    nutritionSummary: {
      calories: 2250,
      protein: 118,
      carbs: 295,
      fat: 70,
    },
    tips: [
      "Focus on complete protein sources like tofu, tempeh, and legume-grain combinations",
      "Consider supplementing with vitamin B12, which is difficult to obtain from plant sources",
      "Time your carbohydrate intake around your workouts for optimal performance",
      "Include plenty of iron-rich foods like spinach, lentils, and fortified cereals",
      "Stay hydrated and consider adding electrolytes during intense training sessions",
    ],
  },
  5: {
    title: "Mediterranean Diet",
    category: "Health",
    difficulty: "Beginner",
    prepTime: "25 min",
    calories: "2100",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Mediterranean",
    description:
      "Based on the traditional eating habits of countries bordering the Mediterranean Sea, this plan emphasizes whole foods, healthy fats, and moderate consumption of animal products.",
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        items: [
          {
            name: "Greek Yogurt Parfait",
            description: "With honey, walnuts, and fresh berries",
            calories: 300,
            protein: 15,
            carbs: 30,
            fat: 15,
          },
          {
            name: "Whole Grain Toast",
            description: "With olive oil and tomato",
            calories: 150,
            protein: 4,
            carbs: 20,
            fat: 7,
          },
        ],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        items: [
          {
            name: "Mediterranean Salad",
            description: "With chickpeas, feta, olives, cucumber, tomato, and olive oil dressing",
            calories: 400,
            protein: 15,
            carbs: 30,
            fat: 25,
          },
          { name: "Whole Grain Pita", description: "Half pita", calories: 80, protein: 3, carbs: 15, fat: 1 },
        ],
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        items: [
          {
            name: "Mixed Nuts",
            description: "Small handful of almonds, walnuts, and pistachios",
            calories: 170,
            protein: 6,
            carbs: 6,
            fat: 15,
          },
          { name: "Fresh Fruit", description: "Orange or apple", calories: 80, protein: 0, carbs: 20, fat: 0 },
        ],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        items: [
          {
            name: "Grilled Fish",
            description: "Sea bass with lemon and herbs",
            calories: 250,
            protein: 30,
            carbs: 0,
            fat: 12,
          },
          {
            name: "Roasted Vegetables",
            description: "Eggplant, zucchini, bell peppers with olive oil",
            calories: 150,
            protein: 3,
            carbs: 15,
            fat: 10,
          },
          { name: "Quinoa", description: "With herbs and olive oil", calories: 180, protein: 6, carbs: 30, fat: 3 },
          { name: "Glass of Red Wine", description: "Optional, 5 oz", calories: 125, protein: 0, carbs: 4, fat: 0 },
        ],
      },
      {
        name: "Evening Snack",
        time: "9:00 PM",
        items: [
          {
            name: "Fresh Figs",
            description: "With a small piece of cheese",
            calories: 150,
            protein: 5,
            carbs: 20,
            fat: 5,
          },
        ],
      },
    ],
    nutritionSummary: {
      calories: 2035,
      protein: 87,
      carbs: 190,
      fat: 93,
    },
    tips: [
      "Use olive oil as your primary fat source",
      "Eat fish at least twice a week",
      "Limit red meat to a few times per month",
      "Enjoy meals with family and friends when possible",
      "Stay physically active and practice mindful eating",
    ],
  },
  6: {
    title: "Paleo Meal Plan",
    category: "Health",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2300",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "Paleo",
    description:
      "Based on foods similar to what might have been eaten during the Paleolithic era. Focuses on whole foods like lean meats, fish, fruits, vegetables, nuts, and seeds while avoiding processed foods, grains, dairy, and legumes.",
    meals: [
      {
        name: "Breakfast",
        time: "7:30 AM",
        items: [
          {
            name: "Sweet Potato Hash",
            description: "With bell peppers, onions, and two fried eggs",
            calories: 400,
            protein: 18,
            carbs: 35,
            fat: 22,
          },
          { name: "Avocado", description: "Half, sliced", calories: 120, protein: 1, carbs: 6, fat: 10 },
        ],
      },
      {
        name: "Mid-Morning Snack",
        time: "10:30 AM",
        items: [
          { name: "Mixed Berries", description: "1 cup fresh berries", calories: 80, protein: 1, carbs: 20, fat: 0 },
          { name: "Almonds", description: "Small handful", calories: 160, protein: 6, carbs: 6, fat: 14 },
        ],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        items: [
          {
            name: "Grilled Chicken Salad",
            description: "With mixed greens, cucumber, tomato, and olive oil-lemon dressing",
            calories: 350,
            protein: 35,
            carbs: 10,
            fat: 20,
          },
          {
            name: "Baked Sweet Potato",
            description: "Medium, with coconut oil",
            calories: 200,
            protein: 2,
            carbs: 40,
            fat: 5,
          },
        ],
      },
      {
        name: "Afternoon Snack",
        time: "4:00 PM",
        items: [{ name: "Apple", description: "With almond butter", calories: 200, protein: 5, carbs: 25, fat: 10 }],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        items: [
          {
            name: "Grilled Salmon",
            description: "6 oz with herbs and lemon",
            calories: 300,
            protein: 34,
            carbs: 0,
            fat: 18,
          },
          {
            name: "Roasted Brussels Sprouts",
            description: "With olive oil and garlic",
            calories: 120,
            protein: 4,
            carbs: 12,
            fat: 7,
          },
          { name: "Cauliflower Rice", description: "Seasoned with herbs", calories: 80, protein: 2, carbs: 16, fat: 0 },
        ],
      },
      {
        name: "Evening Snack",
        time: "9:00 PM",
        items: [
          { name: "Herbal Tea", description: "Unsweetened", calories: 0, protein: 0, carbs: 0, fat: 0 },
          { name: "Mixed Nuts", description: "Small handful", calories: 170, protein: 6, carbs: 6, fat: 15 },
        ],
      },
    ],
    nutritionSummary: {
      calories: 2180,
      protein: 114,
      carbs: 176,
      fat: 121,
    },
    tips: [
      "Focus on quality protein sources like grass-fed meat, wild-caught fish, and free-range eggs",
      "Include a variety of colorful vegetables for micronutrients",
      "Use natural fats like olive oil, coconut oil, and avocados",
      "Stay hydrated with water and herbal teas",
      "Consider intermittent fasting to mimic ancestral eating patterns",
    ],
  },
}

export default function MealPlanDetailsPage() {
  const params = useParams()
  const mealPlanId = Number(params.id)

  // Get meal plan details or provide fallback for unknown meal plans
  const details = mealPlanDetails[mealPlanId as keyof typeof mealPlanDetails] || {
    title: "Unknown Meal Plan",
    description: "Meal plan details not found",
    category: "",
    difficulty: "",
    prepTime: "",
    calories: "",
    image: "/placeholder.svg?height=600&width=800",
    dietType: "",
    meals: [],
    nutritionSummary: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    tips: [],
  }

  // Calculate total macros for each meal
  const getMealTotals = (meal: any) => {
    return meal.items.reduce(
      (acc: any, item: any) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/nutrition" className="flex items-center gap-1 text-sm hover:underline">
          <ArrowLeftCircle className="h-5 w-5" /> Back to Meal Plans
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <div className="relative h-64 w-full">
              <Image src={details.image || "/placeholder.svg"} alt={details.title} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary">{details.dietType}</Badge>
              </div>
            </div>
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{details.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{details.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-primary" />
                  <span className="text-sm">{details.prepTime} prep time</span>
                </div>
                <div className="flex items-center">
                  <Flame className="mr-1 h-4 w-4 text-primary" />
                  <span className="text-sm">{details.calories} calories/day</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-1 h-4 w-4 text-primary" />
                  <span className="text-sm">{details.difficulty} difficulty</span>
                </div>
                <div className="flex items-center">
                  <Utensils className="mr-1 h-4 w-4 text-primary" />
                  <span className="text-sm">{details.category}</span>
                </div>
              </div>

              <Tabs defaultValue="meals" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="meals">Daily Meals</TabsTrigger>
                  <TabsTrigger value="tips">Tips & Guidelines</TabsTrigger>
                </TabsList>
                <TabsContent value="meals" className="space-y-4 pt-4">
                  {details.meals.map((meal, index) => {
                    const mealTotals = getMealTotals(meal)
                    return (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="bg-secondary/5 pb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">{meal.name}</CardTitle>
                              <CardDescription>{meal.time}</CardDescription>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{mealTotals.calories} cal</div>
                              <div className="text-muted-foreground">
                                P: {mealTotals.protein}g • C: {mealTotals.carbs}g • F: {mealTotals.fat}g
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {meal.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="border-b pb-2 last:border-0 last:pb-0">
                                <div className="flex justify-between">
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">{item.description}</div>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap">
                                    <div>{item.calories} cal</div>
                                    <div className="text-muted-foreground">
                                      P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>
                <TabsContent value="tips" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tips for Success</CardTitle>
                      <CardDescription>Follow these guidelines for best results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                              <Apple className="h-4 w-4 text-primary" />
                            </div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
              <CardDescription>Daily macronutrient breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Calories</span>
                  <span className="font-bold">{details.nutritionSummary.calories} kcal</span>
                </div>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Protein</span>
                  <span className="font-bold">{details.nutritionSummary.protein}g</span>
                </div>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${((details.nutritionSummary.protein * 4) / details.nutritionSummary.calories) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(((details.nutritionSummary.protein * 4) / details.nutritionSummary.calories) * 100)}% of
                  total calories
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Carbohydrates</span>
                  <span className="font-bold">{details.nutritionSummary.carbs}g</span>
                </div>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${((details.nutritionSummary.carbs * 4) / details.nutritionSummary.calories) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(((details.nutritionSummary.carbs * 4) / details.nutritionSummary.calories) * 100)}% of
                  total calories
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Fat</span>
                  <span className="font-bold">{details.nutritionSummary.fat}g</span>
                </div>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${((details.nutritionSummary.fat * 9) / details.nutritionSummary.calories) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(((details.nutritionSummary.fat * 9) / details.nutritionSummary.calories) * 100)}% of total
                  calories
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Meal Plan Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Use This Meal Plan</Button>
              <Button variant="outline" className="w-full">
                Save to Favorites
              </Button>
              <Button variant="outline" className="w-full">
                Print Meal Plan
              </Button>
              <Button variant="outline" className="w-full">
                Generate Shopping List
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Dietary Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Diet Type</span>
                  <span className="font-medium">{details.dietType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty</span>
                  <span className="font-medium">{details.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prep Time</span>
                  <span className="font-medium">{details.prepTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-medium">{details.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

