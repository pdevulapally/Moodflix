"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const moods = [
  { emoji: "😊", name: "Happy", color: "bg-yellow-400" },
  { emoji: "😢", name: "Sad", color: "bg-blue-400" },
  { emoji: "😎", name: "Cool", color: "bg-purple-400" },
  { emoji: "😍", name: "Romantic", color: "bg-pink-400" },
  { emoji: "😴", name: "Relaxed", color: "bg-indigo-400" },
  { emoji: "🤔", name: "Thoughtful", color: "bg-green-400" },
];

export default function MoodsPage() {
  const [selectedMood, setSelectedMood] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({ title: "Error", description: "Please select a mood.", variant: "destructive" });
      return;
    }

    localStorage.setItem("selectedMood", selectedMood);
    router.push("/recommendations");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">How are you feeling today?</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((mood) => (
          <motion.div key={mood.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card onClick={() => setSelectedMood(mood.name)} className={`cursor-pointer ${selectedMood === mood.name ? "ring-4 ring-primary" : ""}`}>
              <CardContent className={`flex flex-col items-center justify-center p-6 ${mood.color} rounded-lg`}>
                <span className="text-6xl">{mood.emoji}</span>
                <span className="text-lg font-semibold">{mood.name}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={handleSubmit}>Get Movie Recommendations</Button>
      </div>
    </div>
  );
}
