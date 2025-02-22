'use client'
import axios from "axios"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { formatAnalysisResponse } from "@/lib/formatJSON"





export default function ResumeJDMatching() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdText, setJDText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeFile) {
      toast.error("Please upload a resume before analyzing.")
      return
    }

    if (!jdText.trim()) {
      toast.error("Please enter a Job Description before analyzing.")
      return
    }

    setLoading(true)
    toast.loading("Analyzing resume and JD...")

    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("job_description", jdText)

    try {
      const { data } = await axios.post("http://127.0.0.1:5000/cadidate/match_resume", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      console.log(data.data)
      setAnalysisData(formatAnalysisResponse(data.data) )
      setShowChat(true)
      toast.dismiss()
      toast.success("Analysis complete!")
    } catch (error) {
      toast.dismiss()
      toast.error("Error analyzing resume.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResumeFile(null)
    setJDText("")
    setShowChat(false)
    setAnalysisData(null)
  }

  return (
    <div className="container flex flex-col items-start space-y-4">
      {/* Resume & JD Form */}
      <Card className="mb-4 w-full">
        <CardHeader>
          {/* <CardTitle className="text-left">Resume & JD Matching</CardTitle> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload Resume */}
            <div className="flex flex-col items-start">
              <Label htmlFor="resume" className="text-left">Upload Resume</Label>
              <Input
                id="resume"
                type="file"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full mt-2"
                disabled={loading}
              />
            </div>

            {/* Enter Job Description as Text */}
            <div className="flex flex-col items-start">
              <Label htmlFor="jd" className="text-left">Enter Job Description</Label>
              <Textarea
                id="jd"
                value={jdText}
                onChange={(e) => setJDText(e.target.value)}
                className="w-full mt-2"
                disabled={loading}
              />
            </div>

            {/* Submit & Reset Buttons */}
            <div className="flex space-x-4">
              <Button type="submit" className="w-fit" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Match"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Show Analysis Result */}
      {showChat && analysisData && <ResumeAnalysis data={analysisData} />}
    </div>
  )
}



interface ResumeAnalysisProps {
  data: {
    match_summary: string;
    key_strengths: string[];
    gaps: string[];
    recommendations: string[];
    personalized_feedback: string;
  }
}

function ResumeAnalysis({ data }: ResumeAnalysisProps) {
  // Map keys to friendly labels
  const labelMapping: Record<string, string> = {
    matchSummary: "Match Summary",
    keyStrengths: "Key Strengths",
    gaps: "Gaps",
    recommendations: "Recommendations",
    personalizedFeedback: "Personalized Feedback"
  };

  return (
    <Card className="max-h-[42vh] overflow-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* Heading */}
        <h2 className="text-lg font-bold border-b border-gray-700 pb-2 text-left">
          Here is your detailed analysis of resume considering Job Description
        </h2>

        {/* Data Display */}
        <div className="flex flex-col items-start gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-left">
              <h3 className="text-md font-semibold text-gray-300">• {labelMapping[key] || key}</h3>
              {Array.isArray(value) ? (
                <ul className="list-disc list-inside text-gray-400 mt-1">
                  {value.map((item, index) => (
                    <li key={index} className="text-left">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 mt-1">{value}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
