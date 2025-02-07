"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const languages = ["English", "Spanish", "French", "German", "Italian", "Japanese", "Korean", "Chinese", "Hindi", "Telugu"];
const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller", "Mystery"];

export default function Preferences() {
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const router = useRouter();

  const handleSavePreferences = () => {
    if (!language || !genre) {
      toast({ title: "Error", description: "Please select all preferences before proceeding.", variant: "destructive" });
      return;
    }

    localStorage.setItem("preferences", JSON.stringify({ language, genre }));

    toast({ title: "Preferences Saved", description: "Your preferences have been successfully saved." });
    router.push("/moods");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Set Your Preferences</CardTitle>
          <CardDescription>Customize your Moodflix experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Preferred Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
              <SelectContent>{languages.map((lang) => (<SelectItem key={lang} value={lang}>{lang}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger>
              <SelectContent>{genres.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePreferences} className="w-full">Save Preferences</Button>
        </CardFooter>
      </Card>
       {/* Beta Version Message */}
       <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Note: Moodflix is currently in beta version. This application is still in development, Moodflix may make mistakes. We apologize for any inconvenience caused.</p>
      </div>
    </div>
  );
}
