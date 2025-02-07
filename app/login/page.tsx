"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/preferences")
    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "Login Failed",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/preferences")
    } catch (error) {
      console.error("Error logging in with Google:", error)
      toast({
        title: "Google Login Failed",
        description: "An error occurred while logging in with Google. Please try again.",
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
          <CardTitle>Login to Moodflix</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4">
          <Button 
  variant="outline" 
  className="w-full flex items-center justify-center space-x-2"
  onClick={handleGoogleLogin} 
  disabled={isLoading}
>
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <title>Google Logo</title>
    <defs>
      <clipPath id="g">
        <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
      </clipPath>
    </defs>
    <g className="colors" clipPath="url(#g)">
      <path fill="#FBBC05" d="M0 37V11l17 13z"/>
      <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
      <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
      <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
    </g>
  </svg>
  <span>Sign in with Google</span>
</Button>

          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

