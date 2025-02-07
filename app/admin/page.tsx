"use client"

import { useState, useEffect } from "react"
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface StatusUpdate {
  id: string
  title: string
  description: string
  status: "Operational" | "Degraded" | "Outage"
  timestamp: number
}

export default function AdminStatusPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"Operational" | "Degraded" | "Outage">("Operational")
  const router = useRouter()
  const db = getFirestore()

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        await checkAdmin(currentUser.uid)
      } else {
        router.push("/login") // Redirect if not logged in
      }
    })

    const q = query(collection(db, "statusUpdates"), orderBy("timestamp", "desc"))
    const unsubscribeUpdates = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StatusUpdate)))
    })

    return () => {
      unsubscribeAuth()
      unsubscribeUpdates()
    }
  }, [router])

  const checkAdmin = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists() && userDoc.data().role === "admin") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
        toast({ title: "Access Denied", description: "You do not have admin access.", variant: "destructive" })
        router.push("/login")
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      toast({ title: "Error", description: "Failed to verify admin access.", variant: "destructive" })
      router.push("/login")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    if (!isAdmin) {
      toast({ title: "Access Denied", description: "You do not have permission to post updates.", variant: "destructive" })
      return
    }

    try {
      await addDoc(collection(db, "statusUpdates"), {
        title,
        description,
        status,
        timestamp: Date.now(),
      })
      setTitle("")
      setDescription("")
      toast({ title: "Update Posted", description: "System update has been successfully posted." })
    } catch (error) {
      console.error("Error posting update:", error)
      toast({ title: "Error", description: "Failed to post update.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({ title: "Access Denied", description: "You do not have permission to delete updates.", variant: "destructive" })
      return
    }

    try {
      await deleteDoc(doc(db, "statusUpdates", id))
      toast({ title: "Update Deleted", description: "System update has been removed." })
    } catch (error) {
      console.error("Error deleting update:", error)
      toast({ title: "Error", description: "Failed to delete update.", variant: "destructive" })
    }
  }

  if (!isAdmin) {
    return <p className="text-center text-red-500 mt-10">Access Denied: You are not authorized to view this page.</p>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin - System Updates</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Post a New Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Operational" | "Degraded" | "Outage")}
              className="w-full p-2 border rounded-md"
            >
              <option value="Operational">Operational</option>
              <option value="Degraded">Degraded Performance</option>
              <option value="Outage">Major Outage</option>
            </select>
            <Button type="submit">Post Update</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id}>
            <CardHeader>
              <CardTitle>
                {update.title} - <span className={`text-${update.status === "Operational" ? "green" : update.status === "Degraded" ? "yellow" : "red"}-600`}>{update.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{update.description}</p>
              <p className="text-gray-500 text-sm">{new Date(update.timestamp).toLocaleString()}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => handleDelete(update.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
