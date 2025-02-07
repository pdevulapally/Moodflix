import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen p-4 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Images/1_WoT0DeG-gXTqC4_veycuHg.png')" }} // Change this to your image path
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 max-w-3xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Welcome to MoodFlix</h1>
        <p className="text-xl md:text-2xl mb-8">
          Discover movies tailored to your mood and preferences.
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
