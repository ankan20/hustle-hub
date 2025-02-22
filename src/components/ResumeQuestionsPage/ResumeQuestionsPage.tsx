'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ResumeQuestions } from "@/components/resume-questions/ResumeQuestions"
import toast from "react-hot-toast"
function parseInterviewQuestions(rawString:string) {
  // Regex to match content between triple backticks with an optional "json" tag
  const regex = /```json\s*([\s\S]*?)\s*```/i;
  const match = rawString.match(regex);
  
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      return parsed;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  } else {
    console.error("No valid JSON code block found.");
    return null;
  }
}
export default function ResumeQuestionsPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [responsePayload, setResponsePayload] = useState<any>(null)
  const [showQuestions, setShowQuestions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!resumeFile) {
      // You might use a toast or alert here
      toast.error("Please upload a resume.")
      return
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.")
      return
    }

    setLoading(true);
    toast.loading("Preparing Mock Test...", { id: "preparing" })
    try {
      const formData = new FormData()
      formData.append("file", resumeFile)
      formData.append("job_description", jobDescription)

      const response = await fetch("http://127.0.0.1:5000/cadidate/mock_test", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      
      // Expected response payload:
      // {
      //   "job_description": "...",
      //   "resume_text": "...",
      //   "interview_questions": {
      //      "general_questions": [...],
      //      "project_questions": [...]
      //   }
      // }
      setResponsePayload({
        job_description: data.job_description,
        resume_text: data.resume_text,
        interview_questions: parseInterviewQuestions(data.interview_questions)
      })
      console.log(responsePayload)
      setShowQuestions(true)
      toast.success("Questions generated successfully!", { id: "preparing" })
    } catch (error) {
      console.error("Error generating questions:", error)
      toast.error("Error generating questions.", { id: "preparing" })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setJobDescription("")
    setResponsePayload(null)
    setShowQuestions(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4 w-full">
        <CardHeader>
          {/* <CardTitle>Resume Questions</CardTitle> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload Resume */}
            <div className="flex flex-col items-start">
              <Label htmlFor="resume">Upload Resume</Label>
              <Input
                id="resume"
                type="file"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="mt-2"
              />
            </div>
            {/* Enter Job Description */}
            <div className="flex flex-col items-start">
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea
                id="job_description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
                placeholder="Enter job description here..."
                className="mt-2"
              />
            </div>
            {/* Submit and Reset Buttons */}
            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Generate Questions"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {showQuestions && responsePayload && (
        <ResumeQuestions responsePayload={responsePayload}  />
      )}
    </div>
  )
}
