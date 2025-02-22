'use client'

import { useState } from "react"
import { FileText, MessageSquare, Upload, Briefcase, User } from "lucide-react"
import { useRouter } from "next/navigation";

interface SidebarProps {
  onSelect: (section: string) => void;
  userType: string;
}

export function AppSidebar({ onSelect, userType }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()
  const candidateFeatures = [
    { title: "Resume & JD Matching", icon: FileText, key: "resume-jd" },
    // { title: "Resume Feedback", icon: MessageSquare, key: "resume-feedback" },
    { title: "Mock Test", icon: Upload, key: "mock-test" },
  ]

  const recruiterFeatures = [
    { title: "Job Description Analysis", icon: Briefcase, key: "jd-analysis" },
    { title: "Mock Questions", icon: User, key: "mock-questions" },
  ]

  const features = userType === "candidate" ? candidateFeatures : recruiterFeatures

  const handleSelect = (key: string) => {
    setActiveSection(key)
    onSelect(key)
  }

  return (
    <div className="h-[calc(100vh-48px)] w-64 bg-gray-800 rounded-xl shadow-lg border border-gray-700 ml-6  p-4">
      {/* Sidebar Header */}
      <button className="text-xl font-bold text-white mb-4" onClick={()=>router.push("/")}>HustleHub 🚀💼</button>

      {/* Sidebar Menu */}
      <div className="space-y-2">
        <p className="text-gray-400">Features</p>
        {features.map((feature) => (
          <button
            key={feature.key}
            onClick={() => handleSelect(feature.key)}
            className={`flex items-center  py-3 w-full rounded-lg transition-colors 
            ${activeSection === feature.key ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            <feature.icon className="mr-3 h-5 w-5" />
            <span>{feature.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
