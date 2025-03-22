"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth, db, storage } from "@/firebase-config"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Camera } from "lucide-react"

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("account")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const router = useRouter()

  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "male",
    height: 175,
    weight: 70,
    fitnessLevel: "intermediate",
    fitnessGoal: "buildMuscle",
    theme: "system",
    units: "metric",
    showCalories: true,
    showWeeklyGoals: true,
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      progressUpdates: true,
      newFeatures: false,
    },
  })

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUserData({
            ...userData,
            ...userDoc.data(),
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
          })
        } else {
          // Create a new user document if it doesn't exist
          const newUserData = {
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            firstName: "",
            lastName: "",
            dob: "",
            gender: "male",
            height: 175,
            weight: 70,
            fitnessLevel: "intermediate",
            fitnessGoal: "buildMuscle",
            theme: "system",
            units: "metric",
            showCalories: true,
            showWeeklyGoals: true,
            notifications: {
              workoutReminders: true,
              mealReminders: true,
              progressUpdates: true,
              newFeatures: false,
            },
            createdAt: new Date(),
          }

          await setDoc(userDocRef, newUserData)
          setUserData(newUserData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setUserData({ ...userData, [name]: checked })
    } else {
      setUserData({ ...userData, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserData({ ...userData, [name]: value })
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [key]: checked,
      },
    })
  }

  const handleSaveChanges = async (section: string) => {
    const user = auth.currentUser
    if (!user) return

    setSaving(true)

    try {
      const userDocRef = doc(db, "users", user.uid)

      // Update specific sections based on which tab was saved
      if (section === "account") {
        // Update display name in Firebase Auth
        if (userData.displayName !== user.displayName) {
          await updateProfile(user, {
            displayName: userData.displayName,
          })
        }

        // Update account info in Firestore
        await updateDoc(userDocRef, {
          displayName: userData.displayName,
          firstName: userData.firstName,
          lastName: userData.lastName,
        })
      } else if (section === "profile") {
        // Update profile info in Firestore
        await updateDoc(userDocRef, {
          dob: userData.dob,
          gender: userData.gender,
          height: userData.height,
          weight: userData.weight,
          fitnessLevel: userData.fitnessLevel,
          fitnessGoal: userData.fitnessGoal,
        })
      } else if (section === "preferences") {
        // Update preferences in Firestore
        await updateDoc(userDocRef, {
          theme: userData.theme,
          units: userData.units,
          showCalories: userData.showCalories,
          showWeeklyGoals: userData.showWeeklyGoals,
        })

        // Apply theme change
        if (userData.theme === "dark") {
          document.documentElement.classList.add("dark")
        } else if (userData.theme === "light") {
          document.documentElement.classList.remove("dark")
        }
      } else if (section === "notifications") {
        // Update notification settings in Firestore
        await updateDoc(userDocRef, {
          notifications: userData.notifications,
        })
      }
    } catch (error) {
      console.error("Error saving changes:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const user = auth.currentUser
    if (!user || !e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploadingImage(true)

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profile_images/${user.uid}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update user profile in Firebase Auth
      await updateProfile(user, {
        photoURL: downloadURL,
      })

      // Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
      })

      // Update local state
      setUserData({
        ...userData,
        photoURL: downloadURL,
      })
    } catch (error) {
      console.error("Error uploading profile image:", error)
    } finally {
      setUploadingImage(false)
    }
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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                  <AvatarFallback>
                    {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  disabled={uploadingImage}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" name="displayName" value={userData.displayName} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={userData.firstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={userData.lastName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={userData.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveChanges("account")} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" value={userData.dob} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  value={userData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fitness Profile</CardTitle>
              <CardDescription>Update your fitness details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" value={userData.height} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" value={userData.weight} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                <Select
                  value={userData.fitnessLevel}
                  onValueChange={(value) => handleSelectChange("fitnessLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Primary Fitness Goal</Label>
                <Select
                  value={userData.fitnessGoal}
                  onValueChange={(value) => handleSelectChange("fitnessGoal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loseWeight">Lose Weight</SelectItem>
                    <SelectItem value="buildMuscle">Build Muscle</SelectItem>
                    <SelectItem value="improveEndurance">Improve Endurance</SelectItem>
                    <SelectItem value="maintainHealth">Maintain Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveChanges("profile")} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={userData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Measurement Units</Label>
                <Select value={userData.units} onValueChange={(value) => handleSelectChange("units", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                    <SelectItem value="imperial">Imperial (lb, ft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Show Calories on Dashboard</div>
                    <div className="text-sm text-muted-foreground">
                      Display calorie information on the main dashboard
                    </div>
                  </div>
                  <Switch
                    checked={userData.showCalories}
                    onCheckedChange={(checked) => handleSelectChange("showCalories", checked.toString())}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Show Weekly Goals</div>
                    <div className="text-sm text-muted-foreground">Display weekly goals on the dashboard</div>
                  </div>
                  <Switch
                    checked={userData.showWeeklyGoals}
                    onCheckedChange={(checked) => handleSelectChange("showWeeklyGoals", checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveChanges("preferences")} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Workout Reminders</div>
                    <div className="text-sm text-muted-foreground">Receive reminders for scheduled workouts</div>
                  </div>
                  <Switch
                    checked={userData.notifications.workoutReminders}
                    onCheckedChange={(checked) => handleNotificationChange("workoutReminders", checked)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Meal Reminders</div>
                    <div className="text-sm text-muted-foreground">Receive reminders to log your meals</div>
                  </div>
                  <Switch
                    checked={userData.notifications.mealReminders}
                    onCheckedChange={(checked) => handleNotificationChange("mealReminders", checked)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Progress Updates</div>
                    <div className="text-sm text-muted-foreground">Receive weekly progress reports</div>
                  </div>
                  <Switch
                    checked={userData.notifications.progressUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("progressUpdates", checked)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">New Features</div>
                    <div className="text-sm text-muted-foreground">Receive updates about new app features</div>
                  </div>
                  <Switch
                    checked={userData.notifications.newFeatures}
                    onCheckedChange={(checked) => handleNotificationChange("newFeatures", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveChanges("notifications")} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Notification Settings"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

