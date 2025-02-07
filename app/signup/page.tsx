"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/preferences")
    } catch (error) {
      console.error("Error signing up:", error)
      toast({
        title: "Signup Failed",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/preferences")
    } catch (error) {
      console.error("Error signing up with Google:", error)
      toast({
        title: "Google Signup Failed",
        description: "An error occurred while creating your account with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up for Moodflix</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading}>
              Sign up with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

