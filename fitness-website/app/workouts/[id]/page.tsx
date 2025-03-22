"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeftCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock workout details data - in a real app, you would fetch this from an API
const mockDetails = {
  1: {
    title: "Full Body HIIT",
    steps: [
      "Warm up for 5 minutes",
      "Perform 30 seconds of burpees",
      "Rest for 15 seconds",
      "Repeat for 8 rounds",
      "Cool down for 5 minutes",
    ],
    youtubeUrl: "https://www.youtube.com/embed/J212vz33gU4",
    gifUrl: "https://d2m0n84d5tgmh1.cloudfront.net/training-videos-watermarked/9015.mp4",
  },
  2: {
    title: "Core Strength Builder",
    steps: [
      "Start with a 1-minute plank",
      "Perform 20 crunches",
      "Do 15 Russian twists on each side",
      "Rest for 30 seconds",
      "Repeat 3 times",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  3: {
    title: "Upper Body Power",
    steps: [
      "Warm up with arm circles",
      "4 sets of 10 push-ups",
      "3 sets of 12 dumbbell rows per arm",
      "3 sets of 10 shoulder presses",
      "Cool down and stretch",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  4: {
    title: "Yoga Flow",
    steps: [
      "Begin in mountain pose",
      "Flow through 5 sun salutations",
      "Hold warrior poses for 30 seconds each side",
      "Practice balance poses",
      "End with 5 minutes of meditation",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  5: {
    title: "Cardio Blast",
    steps: [
      "Warm up for 3 minutes",
      "30 seconds of jumping jacks",
      "30 seconds of high knees",
      "30 seconds of butt kicks",
      "15 seconds rest",
      "Repeat 10 times",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  6: {
    title: "Lower Body Focus",
    steps: [
      "Warm up with leg swings",
      "4 sets of 12 squats",
      "3 sets of 10 lunges per leg",
      "3 sets of 15 glute bridges",
      "Stretch all major leg muscles",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  7: {
    title: "HIIT Tabata",
    steps: [
      "20 seconds of squat jumps",
      "10 seconds rest",
      "20 seconds of mountain climbers",
      "10 seconds rest",
      "Repeat for 8 rounds",
      "Rest 1 minute",
      "Complete 4 sets",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  8: {
    title: "Pilates Core",
    steps: [
      "Begin with breathing exercises",
      "Perform the hundred",
      "Roll-ups for 10 reps",
      "Single leg circles",
      "Spine stretch forward",
      "End with relaxation",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
  9: {
    title: "Endurance Run",
    steps: [
      "5 minute warm-up walk",
      "Run at moderate pace for 20 minutes",
      "Increase pace for 10 minutes",
      "Sprint intervals: 30 seconds sprint, 1 minute jog (5 rounds)",
      "5 minute cool-down",
    ],
    youtubeUrl: "",
    gifUrl: "",
  },
}

export default function WorkoutDetailsPage() {
  const params = useParams()
  const workoutId = Number(params.id)

  // Get workout details or provide fallback for unknown workouts
  const details = mockDetails[workoutId as keyof typeof mockDetails] || {
    title: "Unknown Workout",
    steps: ["Workout details not found"],
    youtubeUrl: "",
    gifUrl: "",
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/workouts" className="flex items-center gap-1 text-sm hover:underline">
          <ArrowLeftCircle className="h-5 w-5" /> Back to Workouts
        </Link>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold">{details.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
              {details.steps.map((step, i) => (
                <li key={i} className="mb-2">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {details.youtubeUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Video Tutorial</h3>
              <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src={details.youtubeUrl}
                  title={`${details.title} tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {details.gifUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Exercise Demonstration</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <video className="w-full rounded-md" src={details.gifUrl} autoPlay loop muted controls />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional workout information card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Tips for Maximum Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
            <li>Focus on proper form rather than speed</li>
            <li>Stay hydrated throughout your workout</li>
            <li>Breathe properly - exhale during exertion</li>
            <li>If you feel pain (not muscle fatigue), stop immediately</li>
            <li>Allow for proper rest between workout sessions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

