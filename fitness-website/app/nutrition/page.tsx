"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import your MealPlansList component
import MealPlansList from "@/components/meal-plans-list";

export default function NutritionPage() {
  // 1. States for search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dietTypes, setDietTypes] = useState<string[]>([]);
  const [calorieRanges, setCalorieRanges] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleDietType = (type: string) => {
    setDietTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const toggleCalorieRange = (range: string) => {
    setCalorieRanges((prev) =>
      prev.includes(range) ? prev.filter((item) => item !== range) : [...prev, range]
    );
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
    );
  };

  const applyFilters = () => {
    // Close the dialog
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setDietTypes([]);
    setCalorieRanges([]);
    setGoals([]);
  };

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nutrition Plans</h1>
        <p className="text-muted-foreground">Fuel your body with the right nutrition</p>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Search Box */}
        <div className="relative w-full md:w-164">
          <Input
            type="search"
            placeholder="Search meal plans..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Button (Dialog Trigger) */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          {/* Filter Dialog */}
          <DialogContent className="max-w-4xl sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Filter Meal Plans</DialogTitle>
            </DialogHeader>

            {/* 3-Column Layout for Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              {/* Dietary Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Preferences</CardTitle>
                  <CardDescription>Filter by diet type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean", "Omnivore"].map((diet) => (
                    <label
                      key={diet}
                      className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent/5"
                    >
                      <input
                        type="checkbox"
                        checked={dietTypes.includes(diet)}
                        onChange={() => toggleDietType(diet)}
                        className="h-4 w-4"
                      />
                      <span>{diet}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              {/* Calorie Range */}
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Range</CardTitle>
                  <CardDescription>Filter by daily calories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Under 1500", "1500-2000", "2000-2500", "Over 2500"].map((range) => (
                    <label
                      key={range}
                      className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent/5"
                    >
                      <input
                        type="checkbox"
                        checked={calorieRanges.includes(range)}
                        onChange={() => toggleCalorieRange(range)}
                        className="h-4 w-4"
                      />
                      <span>{range}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Goals</CardTitle>
                  <CardDescription>Filter by fitness goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Weight Loss", "Muscle Building", "Performance", "Health", "Maintenance"].map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent/5"
                    >
                      <input
                        type="checkbox"
                        checked={goals.includes(goal)}
                        onChange={() => toggleGoal(goal)}
                        className="h-4 w-4"
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Dialog Buttons */}
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset All
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for Meal Plans / Nutrition Calculator */}
      <Tabs defaultValue="meal-plans" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="calculator">Nutrition Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="meal-plans">
          {/* Show currently applied filters as badges */}
          {(dietTypes.length > 0 || calorieRanges.length > 0 || goals.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {dietTypes.map((diet) => (
                <Badge
                  key={diet}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleDietType(diet)}
                >
                  {diet} ×
                </Badge>
              ))}
              {calorieRanges.map((range) => (
                <Badge
                  key={range}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleCalorieRange(range)}
                >
                  {range} ×
                </Badge>
              ))}
              {goals.map((goal) => (
                <Badge
                  key={goal}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => toggleGoal(goal)}
                >
                  {goal} ×
                </Badge>
              ))}
            </div>
          )}

          {/* Meal Plans List */}
          <MealPlansList
            searchTerm={searchTerm}
            dietTypes={dietTypes}
            calorieRanges={calorieRanges}
            goals={goals}
          />
        </TabsContent>

        <TabsContent value="calculator">
          {/* Insert your NutritionCalculator or other UI here */}
          <div className="p-4 border rounded-md mt-4">
            <h2 className="text-xl font-bold mb-2">Nutrition Calculator</h2>
            <p className="text-sm text-muted-foreground">
              Placeholder content. Insert your calculator component here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
