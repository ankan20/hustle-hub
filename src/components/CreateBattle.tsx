'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { PlusCircle } from 'react-feather'

export default function CreateBattle() {
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [interviewDuration, setInterviewDuration] = useState<number>(30)
  const [loading, setLoading] = useState<boolean>(false)

  const reset = () => {
    setTitle('')
    setJobDescription('')
    setEndDate('')
    setInterviewDuration(20)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Show a loading toast
    const toastId = toast.loading('Submitting...')
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No token found. Please login.', { id: toastId })
        router.push('/login')
        return
      }
      const response = await axios.post(
        'http://localhost:8000/api/battle',
        { title, jobDescription, endDate, interviewDuration },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        }
      )
      if (response.status === 201) {
        toast.success('Battle created successfully!', { id: toastId });
        reset();
        // router.push(`/battle/${response.data.battle._id}`)
      } else {
        toast.error('Failed to create battle.', { id: toastId })
        
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'An error occurred.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="flex items-center space-x-2 mb-6">
          <PlusCircle className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Create Battle</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter battle title"
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter the job description"
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={4}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="interviewDuration" className="block text-sm font-medium mb-1">
              Interview Duration (minutes)
            </label>
            <input
              id="interviewDuration"
              type="number"
              value={interviewDuration}
              onChange={(e) => setInterviewDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              min={1}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Battle'}
          </button>
        </form>
      </div>
    </div>
  )
}
