"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"; // Import router
import { Clock, Flame, BarChart, Bookmark } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for workouts
const allWorkouts = [
  {
    id: 1,
    title: "Full Body HIIT",
    category: "hiit",
    difficulty: "Intermediate",
    duration: "30 min",
    calories: "350",
    image: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/9015.mp4",
    equipment: "No Equipment",
    steps: [
      "Warm up for 5 minutes.",
      "Perform 30 seconds of burpees.",
      "Rest for 15 seconds.",
      "Repeat for 8 rounds.",
      "Cool down for 5 minutes.",
    ],
    youtubeUrl: "https://www.youtube.com/embed/J212vz33gU4",
  },
  {
    id: 2,
    title: "Core Strength Builder",
    category: "strength",
    difficulty: "Beginner",
    duration: "25 min",
    calories: "220",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Minimal",
  },
  {
    id: 3,
    title: "Upper Body Power",
    category: "strength",
    difficulty: "Advanced",
    duration: "45 min",
    calories: "400",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Full Gym",
  },
  {
    id: 4,
    title: "Yoga Flow",
    category: "flexibility",
    difficulty: "All Levels",
    duration: "40 min",
    calories: "180",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "No Equipment",
  },
  {
    id: 5,
    title: "Cardio Blast",
    category: "cardio",
    difficulty: "Intermediate",
    duration: "20 min",
    calories: "280",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Minimal",
  },
  {
    id: 6,
    title: "Lower Body Focus",
    category: "strength",
    difficulty: "Intermediate",
    duration: "35 min",
    calories: "320",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Full Gym",
  },
  {
    id: 7,
    title: "HIIT Tabata",
    category: "hiit",
    difficulty: "Advanced",
    duration: "25 min",
    calories: "380",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Minimal",
  },
  {
    id: 8,
    title: "Pilates Core",
    category: "flexibility",
    difficulty: "Beginner",
    duration: "30 min",
    calories: "200",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "No Equipment",
  },
  {
    id: 9,
    title: "Endurance Run",
    category: "cardio",
    difficulty: "Advanced",
    duration: "50 min",
    calories: "500",
    image: "/placeholder.svg?height=400&width=600",
    equipment: "Minimal",
  },
]

interface WorkoutsListProps {
  category?: string
  searchTerm?: string
  difficulty?: string | null
  duration?: string | null
  equipment?: string | null
}

export default function WorkoutsList({
  category,
  searchTerm = "",
  difficulty,
  duration,
  equipment,
}: WorkoutsListProps) {
  const router = useRouter(); // Initialize the router

  // 1. Filter by category if provided
  let workouts = category ? allWorkouts.filter((w) => w.category === category) : [...allWorkouts]

  // 2. Partial search by title
  if (searchTerm.trim() !== "") {
    const lowerSearch = searchTerm.toLowerCase()
    workouts = workouts.filter((w) => w.title.toLowerCase().includes(lowerSearch))
  }

  // 3. Filter by difficulty
  if (difficulty) {
    if (difficulty === "Beginner") {
      workouts = workouts.filter((w) => w.difficulty === "Beginner")
    } else if (difficulty === "Intermediate") {
      workouts = workouts.filter((w) => w.difficulty === "Intermediate")
    } else if (difficulty === "Advanced") {
      workouts = workouts.filter((w) => w.difficulty === "Advanced")
    }
  }

  // 4. Filter by duration
  if (duration) {
    workouts = workouts.filter((w) => {
      const numericDuration = Number.parseInt(w.duration, 10)
      if (duration === "< 15 min") {
        return numericDuration < 15
      } else if (duration === "15-30 min") {
        return numericDuration >= 15 && numericDuration <= 30
      } else if (duration === "30+ min") {
        return numericDuration > 30
      }
      return true
    })
  }

  // 5. Filter by equipment
  if (equipment) {
    workouts = workouts.filter((w) => w.equipment === equipment)
  }

  if (workouts.length === 0) {
    return <p className="mt-8">No workouts found.</p>
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className="overflow-hidden h-full">
            <div className="relative h-48 w-full overflow-hidden group">
              {workout.image.endsWith(".mp4") ? (
                <video src={workout.image} autoPlay loop muted className="object-cover h-full w-full" />
              ) : (
                <Image
                  src={workout.image || "/placeholder.svg"}
                  alt={workout.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-primary">{workout.category}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 bg-background/80 hover:bg-background/90"
              >
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Save workout</span>
              </Button>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                <Link href={`/workouts/${workout.id}`} className="hover:underline">
                  {workout.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {workout.duration}
                </div>
                <div className="flex items-center">
                  <Flame className="mr-1 h-4 w-4" />
                  {workout.calories} cal
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-1 h-4 w-4" />
                  {workout.difficulty}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/workouts/${workout.id}`}>View Details</Link>
              </Button>
              <Button size="sm" onClick={() => router.push(`/workouts/LiveWorkout`)}>
                Start Live Workout
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
