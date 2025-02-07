"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import UserProfile from "./user-profile"

const navItems = [
  { title: "Home", href: "/" },
  { title: "Moods", href: "/moods" },
  { title: "Recommendations", href: "/recommendations" },
  { title: "Community", href: "/community" },
  { title: "Settings", href: "/settings" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-purple-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            MoodFlix
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white hover:text-purple-200 transition-colors ${
                  pathname === item.href ? "font-semibold" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <UserProfile />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-purple-900 text-white">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-white hover:text-purple-200 transition-colors ${
                      pathname === item.href ? "font-semibold" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

