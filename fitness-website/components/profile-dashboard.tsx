import type React from "react";
import { Activity, Calendar, TrendingUp, Award, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Accept userData as a prop
export default function ProfileDashboard({ userData }: { userData?: any }) {
  // Fallback if userData is undefined
  const userName = userData?.name || "Alex";

  return (
    <div className="space-y-8">
      {/* Keep the same UI, just replace 'Alex' with userName */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Welcome back, {userName}!</CardTitle>
            <CardDescription>Here's your health summary for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">4 of 5</div>
                <div className="text-sm text-muted-foreground">Weekly workouts completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">80%</div>
                <div className="text-sm text-muted-foreground">Nutrition goal progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2.5 kg</div>
                <div className="text-sm text-muted-foreground">Weight loss this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... the rest of your dashboard UI remains unchanged ... */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="text-xs text-muted-foreground">+8% from last week</div>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <div className="text-xs text-muted-foreground">+12% from last week</div>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "75%" }}></div>
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
          {/* ... weekly goals UI remains the same ... */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  <span>Complete 5 workouts</span>
                </div>
                <span className="text-sm font-medium">4/5</span>
              </div>
              <Progress value={80} className="bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* ... more goals ... */}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Upcoming */}
      {/* ... rest of the dashboard unchanged ... */}
    </div>
  );
}
