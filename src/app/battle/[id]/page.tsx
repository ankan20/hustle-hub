'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft } from 'react-feather';
import { jwtDecode } from 'jwt-decode';

interface Battle {
  _id: string;
  title: string;
  recruiter: {
    username: string;
  };
  jobDescription: string;
  endDate: string;
  interviewDuration: number;
  candidateJoins: string[];
}
const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function BattleDetails() {
  const router = useRouter();
  const params = useParams();
  const battleId = params.id as string;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [attempted, setAttempted] = useState<boolean>(false);
  const [candidateId, setCandidateId] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // Default to front camera
  const [questions, setQuestions] = useState<string>();
  const [transcriptions, setTranscriptions] = useState<{ question: string; answer: string; duration: number }[]>([]);
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentQuestionIndexRef = useRef<number>(0);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [behaviour, setBehaviour] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const [callVariable,setCallVariable] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  useEffect(() => {
    if (callVariable) {
      finalCall();
    }
  }, [callVariable]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; role: string }>(token);
        setCandidateId(decoded.id);
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchBattle() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          router.push('/login');
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/battle/${battleId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        setBattle(response.data);
      } catch (err: any) {
        setError('Failed to fetch battle details.');
      } finally {
        setLoading(false);
      }
    }
    if (battleId) {
      fetchBattle();
    }
  }, [battleId, router]);

  const handleStart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please login.');
        router.push('/login');
        return;
      }
      const response = await axios.get(`http://localhost:8000/api/battle/attempted/${battleId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.data.attempted) {
        toast.error('You have already attempted this battle.');
      } else {
        toast.success('Starting battle...');
        setAttempted(true);
        startRecording();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error checking battle attempt status.');
    }
  };


  const fetchInterviewQuestions = async (duration: number, jobDescription: string) => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/get-questions", {
        duration,
        jobDescription,
      });
      return res.data.question; // Array of questions
    } catch (error) {
      console.error("Error fetching questions:", error);
      return "";
    }
  };
  const startRecording = async () => {
    try {
      const questionsRes = await fetchInterviewQuestions(battle?.interviewDuration || 0, battle?.jobDescription || '');
      setQuestions(questionsRes);
      console.log('Questions:', questionsRes);
      // Request media stream with the selected camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }, // Use the current facing mode
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        console.log('Recording finished', blob);
      };

      // Start Speech-to-Text using Web API
      mediaRecorder.start();
      setRecording(true);
      startTimeRef.current = Date.now(); // Track start time
      setCountdown(battle?.interviewDuration || 0);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            stopRecording();
            return 0;
          }
        });
      }, 60000); // Reduce every 1 minute
      // Start Speech-to-Text
    startSpeechRecognition();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };



  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setCountdown(null);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Stop the webcam stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null; // Remove stream from video element
    }

    // Apply orange overlay effect
    if (videoRef.current) {
      videoRef.current.style.filter = "brightness(0.5) sepia(1) hue-rotate(-50deg)";
    }
     // Stop Speech Recognition
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
    // Wait a moment to ensure all data is captured before sending
    setTimeout(async () => {
      await sendVideo();
      await sendInterviewData();
      setCallVariable(true);
      // await finalCall();
    }, 1000);
  };

  //next qs logic
  // Speech-to-Text Recognition
const startSpeechRecognition = () => {
  if (!window.webkitSpeechRecognition) {
    toast.error("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognitionRef.current = recognition;
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    console.log("Speech recognition started...");
  };
  recognition.onresult = (event: any) => {
    const transcriptTemp = event.results[0][0].transcript;
    console.log("Speech-to-Text:", transcript);
    // if(questions)
    //   storeAnswer(transcript);
    setTranscript(transcriptTemp);

  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended.");
  };

  recognition.start();
};
  
  // Store answer with duration
const storeAnswer = (text: string) => {
  const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
  const currentQuestion = questions || "Unknown Question";

  setTranscriptions((prev) => [...prev, { question: currentQuestion, answer: text, duration }]);
  
  console.log(`Stored Answer: ${text} (Duration: ${duration}s)`);
};

const handleNextQuestion = async () => {
  if (!questions || currentQuestionIndexRef.current >= 10) {
    toast.success("Interview complete!");
    stopRecording();
    return;
  }

  

  // Stop current recognition session before moving to next question
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    storeAnswer(transcript);
  }

  currentQuestionIndexRef.current += 1;
  const qs = await fetchInterviewQuestions(battle?.interviewDuration || 0, battle?.jobDescription || '');
  setQuestions(qs);

  // Restart speech recognition for the next question
  startSpeechRecognition();
};




  const sendVideo = async () => {
    if (recordedChunks.current.length === 0) {
      console.error("No recorded data available.");
      return;
    }

    const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'recording.webm');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please login.');
        return;
      }

      const response = await axios.post(`http://127.0.0.1:5000/analyze-video`, formData
      );
      console.log(response.data);
      setBehaviour(response.data); // Store evaluation in state
      toast.success('Video uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading video.');
    }
  };

  const sendInterviewData = async () => {

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please login.");
        return;
      }

      const response = await axios.post("http://127.0.0.1:5000/check-ans", {
        responses: transcriptions
      });
      console.log(transcriptions);
      console.log("Interview Data Sent:", response.data);
      setEvaluation(response.data); // Store evaluation in state
      toast.success("Interview data uploaded successfully!");
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error uploading interview data.");
    }
  };

  const finalCall = async () => {
    try {
      console.log("start")
      console.log([""], behaviour.final_score, evaluation.score)
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        router.push('/login');
        return;
      }
      const response = await axios.post(`http://localhost:8000/api/interview/complete/${battleId}`,{
        responses:[""], behaviour_score:behaviour.final_score || 30, technical_score:evaluation.score || 58
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("ok")
     console.log(response.data);
     setCallVariable(false);
    } catch (err: any) {
      setError('Failed to fetch battle details.');
    } finally {
      console.log('done')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/chat?userType=candidate')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back Home</span>
          </button>
          <h1 className="text-3xl font-bold">Battle Details</h1>
        </div>
        {loading && <p>Loading battle details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {/* {battle && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-2">{battle.title}</h2>
            <p className="text-sm mb-4">Created by: {battle.recruiter?.username}</p>
            <p className="mb-2">
              <strong>Job Description:</strong> {battle.jobDescription}
            </p>
            <p className="mb-2">
              <strong>End Date:</strong> {new Date(battle.endDate).toLocaleString()}
            </p>
            <p className="mb-4">
              <strong>Interview Duration:</strong> {battle.interviewDuration} minutes
            </p>
            <div className="border border-gray-700 rounded-md p-4 mb-6 bg-gray-700 relative">
              <video ref={videoRef} autoPlay className="w-full rounded-md transform scale-x-[-1]"></video>
              {recording && countdown !== null && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md">
                  {countdown} min left
                </div>
              )}
            </div>
            {questions && recording && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Interview Questions</h3>
                <ul>
                  {questions.map((question, index) => (
                    <li key={index} className="mb-2">
                      <strong>Q{index + 1}:</strong> {question}
                      {index === currentQuestionIndexRef.current && (
                        <p className="text-green-500 mt-1">
                          <strong>Answer:</strong> {transcriptions.find(t => t.question === question)?.answer || "Listening..."}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next Question
                </button>
              </div>
            )}



            {!recording ? (
              <button
                onClick={handleStart}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        )} */}
        {battle && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-2">{battle.title}</h2>
            <p className="text-sm mb-4">Created by: {battle.recruiter?.username}</p>
            <p className="mb-2">
              <strong>Job Description:</strong> {battle.jobDescription}
            </p>
            <p className="mb-2">
              <strong>End Date:</strong> {new Date(battle.endDate).toLocaleString()}
            </p>
            <p className="mb-4">
              <strong>Interview Duration:</strong> {battle.interviewDuration} minutes
            </p>

            <div className="border border-gray-700 rounded-md p-4 mb-6 bg-gray-700 relative">
              <video ref={videoRef} autoPlay className="w-full rounded-md transform scale-x-[-1]"></video>
              {recording && countdown !== null && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md">
                  {countdown} min left
                </div>
              )}
            </div>

            {questions && recording && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Interview Questions</h3>
                <ul>
                {questions && (
          <div className="mb-2">
            <strong>Q:</strong> {questions}
            <p className="text-green-500 mt-1">
              <strong>Answer:</strong>{" "}
              {transcriptions.find((t) => t.question === questions)?.answer || "Listening..."}
            </p>
          </div>
        )}
                </ul>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next Question
                </button>
              </div>
            )}

            {!recording ? (
              <button
                onClick={handleStart}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Stop
              </button>
            )}

            {/* Show evaluation results below after completion */}
            {evaluation && (
              <div className="mt-6 p-4 bg-gray-800 rounded-md">
                <h3 className="text-xl font-bold text-white">Evaluation Results</h3>
                <p className="text-green-400 text-lg">Final Score: {evaluation.final_score}/100</p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-300">Detailed Feedback</h4>
                  <ul className="mt-2">
                    {evaluation.evaluation_results.map((res:any, index:any) => (
                      <li key={index} className="mb-3 p-2 bg-gray-700 rounded">
                        <p className="text-white"><strong>Q{index + 1}:</strong> {res.question}</p>
                        <p className="text-blue-300"><strong>Answer:</strong> {res.answer}</p>
                        <p className="text-green-400"><strong>Score:</strong> {res.score}/100</p>
                        <p className="text-yellow-400"><strong>Feedback:</strong> {res.feedback}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
