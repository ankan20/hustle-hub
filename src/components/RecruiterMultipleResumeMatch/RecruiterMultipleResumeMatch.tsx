'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecruiterMultipleResumeMatch() {
  const [resumes, setResumes] = useState<FileList | null>(null)
  const [jd, setJD] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating API call with dummy data
    setResult(`
      Best fit candidates:
      1. John Doe (90% match)
      Reasons:
      - 5 years of experience in full-stack development
      - Strong background in React.js and Node.js
      - Experience with CI/CD pipelines

      2. Jane Smith (85% match)
      Reasons:
      - 3 years of experience in front-end development
      - Expertise in React.js and state management libraries
      - Familiarity with Agile methodologies

      3. Mike Johnson (80% match)
      Reasons:
      - 4 years of experience in back-end development
      - Strong skills in Node.js and database management
      - Experience with cloud platforms (AWS, Azure)
    `)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple Resume Match</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="resumes" className="block text-sm font-medium text-gray-700">Upload Resumes</label>
            <Input
              id="resumes"
              type="file"
              multiple
              onChange={(e) => setResumes(e.target.files)}
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
          <Button type="submit">Find Best Matches</Button>
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