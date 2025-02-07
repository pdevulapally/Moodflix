"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Film, Users, Settings } from "lucide-react"
import type React from "react" // Added import for React

const sidebarNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Recommendations",
    href: "/recommendations",
    icon: Film,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[300px] px-1">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

