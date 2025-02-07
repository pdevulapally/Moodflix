import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import "./globals.css"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MoodFlix",
  description: "Get movie recommendations based on your mood",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

