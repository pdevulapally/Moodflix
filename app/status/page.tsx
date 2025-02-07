"use client"

import { useState, useEffect } from "react"
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusUpdate {
  id: string
  title: string
  description: string
  status: "Operational" | "Degraded" | "Outage"
  timestamp: number
}

export default function StatusPage() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const db = getFirestore()

  useEffect(() => {
    const q = query(collection(db, "statusUpdates"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StatusUpdate)))
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">System Status</h1>
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id}>
            <CardHeader>
              <CardTitle>{update.title} - <span className={`text-${update.status === "Operational" ? "green" : update.status === "Degraded" ? "yellow" : "red"}-600`}>{update.status}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p>{update.description}</p>
              <p className="text-gray-500 text-sm">{new Date(update.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
