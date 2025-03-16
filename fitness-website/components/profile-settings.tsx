"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, get, set as dbSet } from "firebase/database";
import {
  getAuth,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { firestore, realtimeDb } from "@/firebase-config";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileSettings() {
  const auth = getAuth();
  const user = auth.currentUser;

  // ----------------------
  // Account State (with currentPassword)
  // ----------------------
  const [accountInfo, setAccountInfo] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  // ----------------------
  // Personal Information (Firestore)
  // ----------------------
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "male",
  });

  // ----------------------
  // Fitness Profile (Realtime Database)
  // ----------------------
  const [fitnessProfile, setFitnessProfile] = useState({
    height: "175",
    weight: "70",
    fitnessLevel: "intermediate",
    fitnessGoal: "loseWeight",
  });

  // ----------------------
  // Preferences State
  // ----------------------
  const [preferences, setPreferences] = useState({
    theme: "system",
    units: "metric",
    showCalories: true,
    showWeeklyGoals: true,
  });

  // ----------------------
  // Notifications State
  // ----------------------
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    newFeatures: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountInfo({
        email: user.email || "",
        username: user.displayName || "",
        currentPassword: "",
        newPassword: "",
      });

      const loadPersonalInfo = async () => {
        try {
          const docRef = doc(firestore, "personalInfo", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPersonalInfo(docSnap.data());
          }
        } catch (error) {
          console.error("Error loading personal info:", error);
        }
      };

      const loadFitnessProfile = async () => {
        try {
          const fitnessRef = ref(realtimeDb, `fitnessProfiles/${user.uid}`);
          const snapshot = await get(fitnessRef);
          if (snapshot.exists()) {
            setFitnessProfile(snapshot.val());
          }
        } catch (error) {
          console.error("Error loading fitness profile:", error);
        }
      };

      const loadPreferences = async () => {
        try {
          const prefRef = doc(firestore, "preferences", user.uid);
          const prefSnap = await getDoc(prefRef);
          if (prefSnap.exists()) {
            setPreferences(prefSnap.data());
            if (prefSnap.data().theme !== "system") {
              document.documentElement.classList.toggle("dark", prefSnap.data().theme === "dark");
            }
          }
        } catch (error) {
          console.error("Error loading preferences:", error);
        }
      };

      const loadNotifications = async () => {
        try {
          const notifRef = doc(firestore, "notifications", user.uid);
          const notifSnap = await getDoc(notifRef);
          if (notifSnap.exists()) {
            setNotifications(notifSnap.data());
          }
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      };

      loadPersonalInfo();
      loadFitnessProfile();
      loadPreferences();
      loadNotifications();
    }
  }, [user]);

  // ----------------------
  // Account Save Handler (with reauthentication for password update)
  // ----------------------
  const handleAccountSave = async () => {
    if (!user) {
      alert("Not authenticated. You need to be logged in to update your account.");
      return;
    }
    setIsLoading(true);
    try {
      if (accountInfo.email !== user.email) {
        await firebaseUpdateEmail(user, accountInfo.email);
      }
      if (accountInfo.username !== user.displayName) {
        await updateProfile(user, { displayName: accountInfo.username });
      }
      if (accountInfo.newPassword) {
        if (!accountInfo.currentPassword) {
          alert("Re-authentication required: Please enter your current password.");
          setIsLoading(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email!, accountInfo.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await firebaseUpdatePassword(user, accountInfo.newPassword);
        setAccountInfo((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      }
      alert("Account updated successfully.");
    } catch (error: any) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Save Personal Information to Firestore
  // ----------------------
  const savePersonalInfo = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const docRef = doc(firestore, "personalInfo", user.uid);
      await setDoc(docRef, personalInfo, { merge: true });
      alert("Your personal information has been saved.");
    } catch (error: any) {
      alert("Error saving your personal information.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Save Fitness Profile to Realtime DB
  // ----------------------
  const saveFitnessProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fitnessRef = ref(realtimeDb, `fitnessProfiles/${user.uid}`);
      await dbSet(fitnessRef, fitnessProfile);
      alert("Your fitness profile has been saved.");
    } catch (error: any) {
      alert("Error saving your fitness profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Save Preferences Handler
  // ----------------------
  const savePreferences = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const prefRef = doc(firestore, "preferences", user.uid);
      await setDoc(prefRef, preferences, { merge: true });
      if (preferences.theme !== "system") {
        document.documentElement.classList.toggle("dark", preferences.theme === "dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
      alert("Your app preferences have been updated.");
    } catch (error: any) {
      alert("Error saving your preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Save Notification Settings Handler
  // ----------------------
  const saveNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const notifRef = doc(firestore, "notifications", user.uid);
      await setDoc(notifRef, notifications, { merge: true });
      alert("Your notification preferences have been updated.");
    } catch (error: any) {
      alert("Error saving your notification settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Tabs defaultValue="account" className="space-y-4 w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="account" className="flex-1 text-center">Account</TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 text-center">Profile</TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1 text-center">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 text-center">Notifications</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={accountInfo.email} 
                  onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={accountInfo.username}
                  onChange={(e) => setAccountInfo({ ...accountInfo, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={accountInfo.currentPassword}
                  onChange={(e) => setAccountInfo({ ...accountInfo, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={accountInfo.newPassword}
                  onChange={(e) => setAccountInfo({ ...accountInfo, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAccountSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <div className="font-medium">Current Plan: Premium</div>
                <div className="text-sm text-muted-foreground">Renews on June 15, 2023</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Auto-Renewal</div>
                    <div className="text-sm text-muted-foreground">Automatically renew your subscription</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Billing History</Button>
              <Button variant="outline">Change Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details (stored in Firestore)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={personalInfo.firstName} 
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup 
                  value={personalInfo.gender} 
                  onValueChange={(value) => setPersonalInfo({ ...personalInfo, gender: value })}
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
            <CardFooter>
              <Button onClick={savePersonalInfo} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Fitness Profile</CardTitle>
              <CardDescription>Update your fitness details (stored in Realtime Database)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    value={fitnessProfile.height}
                    onChange={(e) => setFitnessProfile({ ...fitnessProfile, height: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={fitnessProfile.weight}
                    onChange={(e) => setFitnessProfile({ ...fitnessProfile, weight: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                <Select 
                  value={fitnessProfile.fitnessLevel}
                  onValueChange={(value) => setFitnessProfile({ ...fitnessProfile, fitnessLevel: value })}
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
                  value={fitnessProfile.fitnessGoal}
                  onValueChange={(value) => setFitnessProfile({ ...fitnessProfile, fitnessGoal: value })}
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
              <Button onClick={saveFitnessProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                >
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
                <Select 
                  value={preferences.units}
                  onValueChange={(value) => setPreferences({ ...preferences, units: value })}
                >
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
                    checked={preferences.showCalories}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, showCalories: checked })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Show Weekly Goals</div>
                    <div className="text-sm text-muted-foreground">
                      Display weekly goals on the dashboard
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.showWeeklyGoals}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, showWeeklyGoals: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Workout Reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Receive reminders for scheduled workouts
                    </div>
                  </div>
                  <Switch
                    checked={notifications.workoutReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, workoutReminders: checked })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Meal Reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Receive reminders to log your meals
                    </div>
                  </div>
                  <Switch
                    checked={notifications.mealReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, mealReminders: checked })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Progress Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Receive weekly progress reports
                    </div>
                  </div>
                  <Switch
                    checked={notifications.progressUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, progressUpdates: checked })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">New Features</div>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about new app features
                    </div>
                  </div>
                  <Switch
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotifications} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
