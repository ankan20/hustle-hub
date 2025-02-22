'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { AppSidebar } from '@/components/app-sidebar/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Home from '@/components/Home'

export default function Page() {
  const router = useRouter()

  const handleUserTypeSelection = (type: 'candidate' | 'recruiter') => {
    router.push(`/chat?type=${type}`)
  }

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
    //   <motion.div
    //     initial={{ opacity: 0, y: -50 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.5 }}
    //     className="text-center"
    //   >
    //     <h1 className="text-6xl font-bold text-white mb-4">HustleHub</h1>
    //     <p className="text-xl text-white mb-8">
    //       Your go-to platform for career hustlers! 🚀💼
    //     </p>
    //   </motion.div>
    //   <motion.div
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.5, delay: 0.2 }}
    //     className="space-x-4"
    //   >
    //     <Button
    //       onClick={() => handleUserTypeSelection('candidate')}
    //       className="bg-white text-purple-600 hover:bg-purple-100"
    //     >
    //       I'm a Candidate
    //     </Button>
    //     <Button
    //       onClick={() => handleUserTypeSelection('recruiter')}
    //       className="bg-white text-pink-600 hover:bg-pink-100"
    //     >
    //       I'm a Recruiter
    //     </Button>
    //   </motion.div>
    // </div>
    <>
      <Home />
    </>
  )
}