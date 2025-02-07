"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import type React from "react" // Added import for React

const languages = ["English", "Spanish", "French", "German", "Italian"]
const themes = ["Light", "Dark", "System"]

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState("English")
  const [theme, setTheme] = useState("System")
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // TODO: Fetch user settings from Firebase
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Save settings to Firebase
      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Settings</CardTitle>
          <CardDescription className="text-purple-200">Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-purple-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">
                Preferred Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="bg-purple-700 text-white">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-white">
                Theme
              </Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="bg-purple-700 text-white">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t} value={t.toLowerCase()}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              <Label htmlFor="notifications" className="text-white">
                Enable notifications
              </Label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

