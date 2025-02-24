'use client'

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FileText, MessageSquare, Upload, Briefcase, User } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar/AppSidebar"
import ResumeJDMatching from "@/components/ResumeJDMatching/ResumeJDMatching"
import ResumeQuestionsPage from "@/components/ResumeQuestionsPage/ResumeQuestionsPage"
import BattleList from "@/components/BattleList"
import CreateBattle from "@/components/CreateBattle"
import RecruiterBattleList from "@/components/RecruiterBattleList"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get("userType") || "candidate"

  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const renderContent = () => {
    switch (selectedSection) {
      case "resume-jd":
        return <div className="text-center">
          <div className="">
            <span className="text-center text-xl font-bold text-white mb-4">📝 Skill Match - </span><span className="text-gray-300 text-sm pb-1">Instantly check how well your resume fits a job.</span>
          </div>

          <ResumeJDMatching />
        </div>
      case "resume-feedback":
        return <div className="text-center text-white">📄 Resume Feedback Component</div>
      case "mock-test":
        return (
          <div className="text-center">
            <div className="">
              <span className="text-center text-xl font-bold text-white mb-4">❓ Interview Prep  - </span><span className="text-gray-300 text-sm pb-1">Prepare for most likely questions</span>
            </div>

            <ResumeQuestionsPage />
          </div>)
      case "jd-analysis":
        return <div className="text-center text-white">📑 JD Analysis Component</div>
      case "mock-questions":
        return <div className="text-center text-white">🗣️ Mock Questions Component</div>
      case "battle-listings":
          return (
            <>
              <BattleList />
            </>
          )
      case "create-battle":
        return (
          <CreateBattle />
        )
      case "your-battles":
        return (
          <>
            <RecruiterBattleList />
          </>
        )
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white text-center space-y-4">
            <MessageSquare className="h-12 w-12 text-gray-400" />
            <h2 className="text-xl font-bold">Choose a task from the sidebar</h2>
            <p className="text-gray-400">Click on any option in the sidebar to get started.</p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-6 w-full">
      {/* Sidebar */}
      <div className="h-full">
        <AppSidebar onSelect={setSelectedSection} userType={userType} />
      </div>

      {/* Right Section */}
      <div className="flex-1 ml-6 bg-gray-800 rounded-lg p-6 shadow-lg">
        {renderContent()}
      </div>
    </div>
  )
}
