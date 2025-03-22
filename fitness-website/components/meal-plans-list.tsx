/*
"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Utensils, BarChart, Bookmark } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Define the type for a meal plan
export interface MealPlan {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  prepTime: string;
  calories: string; // calories stored as string; will be parsed
  image: string;
  dietType: string;
}

type Props = {
  searchTerm?: string;
  dietTypes?: string[];
  calorieRanges?: string[];
  goals?: string[];
};

const mealPlans: MealPlan[] = [
  {
    id: 1,
    title: "High Protein Meal Plan",
    category: "Muscle Building",
    difficulty: "Intermediate",
    prepTime: "30 min",
    calories: "2500",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Omnivore",
  },
  {
    id: 2,
    title: "Vegetarian Weight Loss",
    category: "Weight Loss",
    difficulty: "Beginner",
    prepTime: "20 min",
    calories: "1800",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Vegetarian",
  },
  {
    id: 3,
    title: "Keto Meal Plan",
    category: "Weight Loss",
    difficulty: "Advanced",
    prepTime: "40 min",
    calories: "2000",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Keto",
  },
  {
    id: 4,
    title: "Vegan Performance",
    category: "Performance",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2200",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Vegan",
  },
  {
    id: 5,
    title: "Mediterranean Diet",
    category: "Health",
    difficulty: "Beginner",
    prepTime: "25 min",
    calories: "2100",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Mediterranean",
  },
  {
    id: 6,
    title: "Paleo Meal Plan",
    category: "Health",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2300",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Paleo",
  },
];

export default function MealPlansList(props: Props = {}) {
  // Destructure props with defaults
  const { searchTerm = "", dietTypes = [], calorieRanges = [], goals = [] } = props;
  let filteredPlans = mealPlans;

  // 1. Partial search: filter by title
  if (searchTerm.trim() !== "") {
    const lowerSearch = searchTerm.toLowerCase();
    filteredPlans = filteredPlans.filter((plan) =>
      plan.title.toLowerCase().includes(lowerSearch)
    );
  }

  // 2. Filter by diet type (if any selected)
  if (dietTypes.length > 0) {
    filteredPlans = filteredPlans.filter((plan) => dietTypes.includes(plan.dietType));
  }

  // 3. Filter by calorie range
  if (calorieRanges.length > 0) {
    filteredPlans = filteredPlans.filter((plan) => {
      const cal = parseInt(plan.calories, 10);
      return calorieRanges.some((range) => {
        if (range === "Under 1500") {
          return cal < 1500;
        } else if (range === "1500-2000") {
          return cal >= 1500 && cal <= 2000;
        } else if (range === "2000-2500") {
          return cal > 2000 && cal <= 2500;
        } else if (range === "Over 2500") {
          return cal > 2500;
        }
        return false;
      });
    });
  }

  // 4. Filter by goals (using category as goal here)
  if (goals.length > 0) {
    filteredPlans = filteredPlans.filter((plan) => goals.includes(plan.category));
  }

  if (filteredPlans.length === 0) {
    return <p className="mt-4">No meal plans found.</p>;
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden h-full">
            <div className="relative h-48 w-full overflow-hidden group">
              <Image
                src={plan.image || "/placeholder.svg"}
                alt={plan.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-primary">{plan.dietType}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 bg-background/80 hover:bg-background/90"
              >
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Save meal plan</span>
              </Button>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <Link href={`/nutrition/${plan.id}`} className="hover:underline">
                  {plan.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {plan.prepTime} prep
                </div>
                <div className="flex items-center">
                  <Utensils className="mr-1 h-4 w-4" />
                  {plan.calories} cal
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-1 h-4 w-4" />
                  {plan.category}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/nutrition/${plan.id}`}>View Details</Link>
              </Button>
              <Button size="sm">Use Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
*/


import Link from "next/link"
import Image from "next/image"
import { Clock, Utensils, BarChart, Bookmark } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for meal plans
const mealPlans = [
  {
    id: 1,
    title: "High Protein Meal Plan",
    category: "Muscle Building",
    difficulty: "Intermediate",
    prepTime: "30 min",
    calories: "2500",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Omnivore",
  },
  {
    id: 2,
    title: "Vegetarian Weight Loss",
    category: "Weight Loss",
    difficulty: "Beginner",
    prepTime: "20 min",
    calories: "1800",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Vegetarian",
  },
  {
    id: 3,
    title: "Keto Meal Plan",
    category: "Weight Loss",
    difficulty: "Advanced",
    prepTime: "40 min",
    calories: "2000",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Keto",
  },
  {
    id: 4,
    title: "Vegan Performance",
    category: "Performance",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2200",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Vegan",
  },
  {
    id: 5,
    title: "Mediterranean Diet",
    category: "Health",
    difficulty: "Beginner",
    prepTime: "25 min",
    calories: "2100",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Mediterranean",
  },
  {
    id: 6,
    title: "Paleo Meal Plan",
    category: "Health",
    difficulty: "Intermediate",
    prepTime: "35 min",
    calories: "2300",
    image: "/placeholder.svg?height=400&width=600",
    dietType: "Paleo",
  },
]

export default function MealPlansList() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden h-full">
            <div className="relative h-48 w-full overflow-hidden group">
              <Image
                src={plan.image || "/placeholder.svg"}
                alt={plan.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-primary">{plan.dietType}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 bg-background/80 hover:bg-background/90"
              >
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Save meal plan</span>
              </Button>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <Link href={`/nutrition/${plan.id}`} className="hover:underline">
                  {plan.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {plan.prepTime} prep
                </div>
                <div className="flex items-center">
                  <Utensils className="mr-1 h-4 w-4" />
                  {plan.calories} cal
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-1 h-4 w-4" />
                  {plan.category}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/nutrition/${plan.id}`}>View Details</Link>
              </Button>
              <Button size="sm">Use Plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

