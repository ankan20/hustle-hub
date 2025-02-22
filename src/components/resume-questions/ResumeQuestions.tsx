// 'use client'

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Textarea } from "@/components/ui/textarea"
// function parseAnswerFeedback(rawString:string) {
//   try {
//     // Directly parse the raw JSON string
//     const parsed = JSON.parse(rawString);
//     return parsed;
//   } catch (error) {
//     console.error("Error parsing answer feedback JSON:", error);
//     return null;
//   }
// }
// interface InterviewQuestions {
//   general_questions: string[]
//   project_questions: string[]
// }

// interface ResponsePayload {
//   job_description: string
//   resume_text: string
//   interview_questions: InterviewQuestions
// }

// interface ResumeQuestionsProps {
//   responsePayload?: ResponsePayload
// }

// // Fallback dummy questions if no payload is provided.
// const dummyQuestions = [
//   "Can you explain your role in the project mentioned on your resume?",
//   "What were the key challenges you faced in your previous position?",
//   "How did you contribute to improving the team's productivity?",
// ]

// export function ResumeQuestions({ responsePayload }: ResumeQuestionsProps) {
//   // Use questions from payload if available, otherwise fallback to dummy questions.
//   const questions =
//     responsePayload && responsePayload.interview_questions
//       ? [
//           ...responsePayload.interview_questions.general_questions,
//           ...responsePayload.interview_questions.project_questions,
//         ]
//       : dummyQuestions
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [userAnswer, setUserAnswer] = useState("")
//   const [submittedFeedback, setSubmittedFeedback] = useState<{
//     answer_analysis: string
//     suggested_answer: string
//     answer_rating: string
//   } | null>(null)
//   const [sampleAnswer, setSampleAnswer] = useState<string>("")
//   const [isLoadingCheck, setIsLoadingCheck] = useState(false)
//   const [isLoadingGet, setIsLoadingGet] = useState(false)

//   // Determine feedback color based on rating.
//   const getFeedbackColor = (rating: string) => {
//     if (rating.toLowerCase() === "perfect") return "bg-green-200"
//     if (rating.toLowerCase() === "medium") return "bg-yellow-200"
//     return "bg-red-200"
//   }

//   // API call to check candidate's answer.
//   const handleAttempt = async () => {
//     // Clear previous feedback and sample answer.
//     setSubmittedFeedback(null)
//     setSampleAnswer("")
//     setIsLoadingCheck(true)
//     try {
//       const payload = {
//         question: questions[currentQuestion],
//         user_answer: userAnswer,
//         job_description: responsePayload?.job_description || "",
//         resume_text: responsePayload?.resume_text || "",
//       }
//       const res = await fetch("http://127.0.0.1:5000/cadidate/check_answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//       const data = await res.json()
//       setSubmittedFeedback(parseAnswerFeedback(data))
//     } catch (error) {
//       console.error("Error checking answer:", error)
//     } finally {
//       setIsLoadingCheck(false)
//     }
//   }

//   // API call to get sample answer.
//   const handleShowAnswer = async () => {
//     // Clear previous feedback.
//     setSubmittedFeedback(null)
//     setIsLoadingGet(true)
//     try {
//       const payload = {
//         question: questions[currentQuestion],
//         job_description: responsePayload?.job_description || "",
//         resume_text: responsePayload?.resume_text || "",
//       }
//       const res = await fetch("http://127.0.0.1:5000/cadidate/get_answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//       const data = await res.json()
//       setSampleAnswer(data.sample_answer)
//     } catch (error) {
//       console.error("Error fetching sample answer:", error)
//     } finally {
//       setIsLoadingGet(false)
//     }
//   }

//   // Proceed to next question.
//   const handleNext = () => {
//     setCurrentQuestion((prev) => (prev < questions.length - 1 ? prev + 1 : prev))
//     // Reset state for new question.
//     setUserAnswer("")
//     setSubmittedFeedback(null)
//     setSampleAnswer("")
//   }

//   return (
//     <Card className="max-w-3xl mx-auto">
//       <CardContent className="p-4 space-y-6">
//         {/* Display question aligned to the left */}
//         <div className="text-left">
//           <h3 className="text-xl font-semibold">
//             Question {currentQuestion + 1}:
//           </h3>
//           <p className="mt-2">{questions[currentQuestion]}</p>
//         </div>

//         {/* Answer input box aligned to the left */}
//         <div className="text-left">
//           <Textarea
//             value={userAnswer}
//             onChange={(e) => setUserAnswer(e.target.value)}
//             placeholder="Type your answer here..."
//             className="w-full"
//           />
//         </div>

//         {/* Centered buttons for actions */}
//         <div className="flex justify-center space-x-4">
//           <Button onClick={handleAttempt} disabled={isLoadingCheck || isLoadingGet}>
//             {isLoadingCheck ? "Checking..." : "Submit Answer"}
//           </Button>
//           <Button
//             onClick={handleShowAnswer}
//             variant="outline"
//             disabled={isLoadingCheck || isLoadingGet}
//           >
//             {isLoadingGet ? "Loading Answer..." : "Show Sample Answer"}
//           </Button>
//           <Button onClick={handleNext} disabled={isLoadingCheck || isLoadingGet}>
//             Next Question
//           </Button>
//         </div>

//         {/* Display feedback from check_answer API */}
//         {submittedFeedback && (
//           <div className={`p-4 rounded ${getFeedbackColor(submittedFeedback.answer_rating)}`}>
//             <p className="font-semibold">Feedback:</p>
//             <p className="mt-1">Analysis: {submittedFeedback.answer_analysis}</p>
//             <p className="mt-1">Suggested Answer: {submittedFeedback.suggested_answer}</p>
//             <p className="mt-1">Rating: {submittedFeedback.answer_rating}</p>
//           </div>
//         )}

//         {/* Display sample answer from get_answer API */}
//         {sampleAnswer && (
//           <div className="bg-gray-100 p-4 rounded">
//             <p className="font-semibold">Sample Answer:</p>
//             <p className="mt-1">{sampleAnswer}</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

function parseAnswerFeedback(rawString: string) {
  try {
    const parsed = JSON.parse(rawString)
    return parsed
  } catch (error) {
    console.error("Error parsing answer feedback JSON:", error)
    return null
  }
}

interface InterviewQuestions {
  general_questions: string[]
  project_questions: string[]
}

interface ResponsePayload {
  job_description: string
  resume_text: string
  interview_questions: InterviewQuestions
}

interface ResumeQuestionsProps {
  responsePayload?: ResponsePayload
}

// Fallback dummy questions if no payload is provided.
const dummyQuestions = [
  "Can you explain your role in the project mentioned on your resume?",
  "What were the key challenges you faced in your previous position?",
  "How did you contribute to improving the team's productivity?",
]

export function ResumeQuestions({ responsePayload }: ResumeQuestionsProps) {
  // Use questions from payload if available, otherwise fallback to dummy questions.
  const questions =
    responsePayload && responsePayload.interview_questions
      ? [
          ...responsePayload.interview_questions.general_questions,
          ...responsePayload.interview_questions.project_questions,
        ]
      : dummyQuestions

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [submittedFeedback, setSubmittedFeedback] = useState<{
    answer_analysis: string
    suggested_answer: string
    answer_rating: string
  } | null>(null)
  const [sampleAnswer, setSampleAnswer] = useState<string>("")
  const [isLoadingCheck, setIsLoadingCheck] = useState(false)
  const [isLoadingGet, setIsLoadingGet] = useState(false)

  // Determine feedback color based on rating.
  const getFeedbackColor = (rating: string) => {
    if (rating.toLowerCase() === "perfect") return "bg-green-200"
    if (rating.toLowerCase() === "medium") return "bg-yellow-200"
    return "bg-red-200"
  }

  // API call to check candidate's answer.
  const handleAttempt = async () => {
    // Clear previous feedback and sample answer.
    setSubmittedFeedback(null)
    setSampleAnswer("")
    setIsLoadingCheck(true)
    try {
      const payload = {
        question: questions[currentQuestion],
        user_answer: userAnswer,
        job_description: responsePayload?.job_description || "",
        resume_text: responsePayload?.resume_text || "",
      }
      const res = await fetch("http://127.0.0.1:5000/cadidate/check_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setSubmittedFeedback(parseAnswerFeedback(data))
    } catch (error) {
      console.error("Error checking answer:", error)
    } finally {
      setIsLoadingCheck(false)
    }
  }

  // API call to get sample answer.
  const handleShowAnswer = async () => {
    // Clear previous feedback.
    setSubmittedFeedback(null)
    setIsLoadingGet(true)
    try {
      const payload = {
        question: questions[currentQuestion],
        job_description: responsePayload?.job_description || "",
        resume_text: responsePayload?.resume_text || "",
      }
      const res = await fetch("http://127.0.0.1:5000/cadidate/get_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setSampleAnswer(data.sample_answer)
    } catch (error) {
      console.error("Error fetching sample answer:", error)
    } finally {
      setIsLoadingGet(false)
    }
  }

  // Proceed to previous question.
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      // Reset state for new question.
      setUserAnswer("")
      setSubmittedFeedback(null)
      setSampleAnswer("")
    }
  }

  // Proceed to next question.
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      // Reset state for new question.
      setUserAnswer("")
      setSubmittedFeedback(null)
      setSampleAnswer("")
    }
  }

  return (
    <Card className=" mx-auto">
      <CardContent className="p-4 space-y-6">
        {/* Display question aligned to the left */}
        <div className="text-left">
          <h3 className="text-xl font-semibold">
            Question {currentQuestion + 1}:
          </h3>
          <p className="mt-2">{questions[currentQuestion]}</p>
        </div>

        {/* Answer input box aligned to the left */}
        <div className="text-left">
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        </div>

        {/* Centered buttons for actions */}
        <div className="flex justify-center space-x-4">
          <Button onClick={handlePrevious} disabled={isLoadingCheck || isLoadingGet || currentQuestion === 0}>
            Previous Question
          </Button>
          <Button onClick={handleAttempt} disabled={isLoadingCheck || isLoadingGet}>
            {isLoadingCheck ? "Checking..." : "Submit Answer"}
          </Button>
          <Button
            onClick={handleShowAnswer}
            variant="outline"
            disabled={isLoadingCheck || isLoadingGet}
          >
            {isLoadingGet ? "Loading Answer..." : "Show Sample Answer"}
          </Button>
          <Button onClick={handleNext} disabled={isLoadingCheck || isLoadingGet || currentQuestion === questions.length - 1}>
            Next Question
          </Button>
        </div>

        {/* Display feedback from check_answer API */}
        {submittedFeedback && (
          <div className={`p-4 rounded ${getFeedbackColor(submittedFeedback.answer_rating)}`}>
            <p className="font-semibold">Feedback:</p>
            <p className="mt-1">Analysis: {submittedFeedback.answer_analysis}</p>
            <p className="mt-1">Suggested Answer: {submittedFeedback.suggested_answer}</p>
            <p className="mt-1">Rating: {submittedFeedback.answer_rating}</p>
          </div>
        )}

        {/* Display sample answer from get_answer API */}
        {sampleAnswer && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Sample Answer:</p>
            <p className="mt-1">{sampleAnswer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
