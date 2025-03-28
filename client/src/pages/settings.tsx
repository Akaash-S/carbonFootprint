import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-neutral-600">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us a bit about yourself and your sustainability journey" 
                    rows={4} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Update Password</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Unit Preferences</CardTitle>
                <CardDescription>
                  Choose your preferred measurement units
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Select defaultValue="km">
                    <SelectTrigger id="distance">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="mi">Miles (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Select defaultValue="kg">
                    <SelectTrigger id="weight">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Select defaultValue="c">
                    <SelectTrigger id="temperature">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c">Celsius (°C)</SelectItem>
                      <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Preferences</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-neutral-600">
                      Use dark theme for the application
                    </p>
                  </div>
                  <Switch id="darkMode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataCompact">Compact View</Label>
                    <p className="text-sm text-neutral-600">
                      Show more content with less spacing
                    </p>
                  </div>
                  <Switch id="dataCompact" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homepage">Default Homepage</Label>
                  <Select defaultValue="dashboard">
                    <SelectTrigger id="homepage">
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="insights">Insights</SelectItem>
                      <SelectItem value="challenges">Challenges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Display Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Calculation</CardTitle>
                <CardDescription>
                  Customize how your carbon footprint is calculated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <Select defaultValue="us">
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    Used for more accurate carbon calculations based on your region's energy mix
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="seasonalAdjust">Seasonal Adjustments</Label>
                    <p className="text-sm text-neutral-600">
                      Account for seasonal changes in your area
                    </p>
                  </div>
                  <Switch id="seasonalAdjust" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Calculation Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when we contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailWeekly">Weekly Summary</Label>
                      <p className="text-sm text-neutral-600">
                        Receive a weekly email with your carbon footprint summary
                      </p>
                    </div>
                    <Switch id="emailWeekly" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailChallenges">Challenge Updates</Label>
                      <p className="text-sm text-neutral-600">
                        Get notified about new challenges and your progress
                      </p>
                    </div>
                    <Switch id="emailChallenges" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailTips">Tips & Suggestions</Label>
                      <p className="text-sm text-neutral-600">
                        Personalized tips to reduce your carbon footprint
                      </p>
                    </div>
                    <Switch id="emailTips" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">In-App Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appActivity">Activity Reminders</Label>
                      <p className="text-sm text-neutral-600">
                        Remind you to log your activities regularly
                      </p>
                    </div>
                    <Switch id="appActivity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appCommunity">Community Interactions</Label>
                      <p className="text-sm text-neutral-600">
                        Notifications about likes, comments, and mentions
                      </p>
                    </div>
                    <Switch id="appCommunity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appMilestones">Milestones & Achievements</Label>
                      <p className="text-sm text-neutral-600">
                        Celebrate when you reach carbon reduction milestones
                      </p>
                    </div>
                    <Switch id="appMilestones" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your data and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Data Sharing</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareProfile">Profile Visibility</Label>
                      <p className="text-sm text-neutral-600">
                        Allow other users to see your profile and achievements
                      </p>
                    </div>
                    <Switch id="shareProfile" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareData">Anonymous Data Collection</Label>
                      <p className="text-sm text-neutral-600">
                        Share anonymized data to improve carbon calculations
                      </p>
                    </div>
                    <Switch id="shareData" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="leaderboard">Appear on Leaderboards</Label>
                      <p className="text-sm text-neutral-600">
                        Show your ranking on community leaderboards
                      </p>
                    </div>
                    <Switch id="leaderboard" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline">Download My Data</Button>
                  <p className="text-sm text-neutral-600">
                    Request a copy of all data associated with your account
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
