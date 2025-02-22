'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatInterface } from "@/components/chat-interface/ChatInterface"

export default function ResumeFeedback() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [showChat, setShowChat] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the file to your backend
    setShowChat(true)
  }

  return (
    <div className="container mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Resume Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resume">Upload Resume</Label>
              <Input
                id="resume"
                type="file"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit">Get Feedback</Button>
          </form>
        </CardContent>
      </Card>
      {showChat && (
        <ChatInterface
          messages={[
            { role: "assistant", content: "I've reviewed your resume. Here's my feedback:" },
            { role: "assistant", content: "1. Your summary is strong, but consider adding a specific achievement." },
            { role: "assistant", content: "2. In your work experience, use more action verbs to describe your responsibilities." },
            { role: "assistant", content: "3. Consider adding a skills section to highlight your technical abilities." },
            { role: "assistant", content: "4. Your education section is well-formatted, good job!" },
          ]}
        />
      )}
    </div>
  )
}