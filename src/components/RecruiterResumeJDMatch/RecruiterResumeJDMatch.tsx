'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecruiterResumeJDMatch() {
  const [resume, setResume] = useState<File | null>(null)
  const [jd, setJD] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating API call with dummy data
    setResult(`
      Questions based on the resume and JD:
      1. Can you describe your experience with React.js?
      2. How have you implemented CI/CD pipelines in your previous roles?
      3. What's your approach to writing unit tests?

      Sample Answers:
      1. I have 3 years of experience with React.js, building complex SPAs and integrating with RESTful APIs.
      2. I've set up CI/CD pipelines using Jenkins and GitLab CI, automating testing and deployment processes.
      3. I follow TDD principles, writing unit tests for individual components and functions to ensure code reliability.
    `)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume & JD Match</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Upload Resume</label>
            <Input
              id="resume"
              type="file"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label htmlFor="jd" className="block text-sm font-medium text-gray-700">Job Description</label>
            <Textarea
              id="jd"
              value={jd}
              onChange={(e) => setJD(e.target.value)}
              rows={5}
            />
          </div>
          <Button type="submit">Generate Questions</Button>
        </form>
        {result && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Results:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}