'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Info } from 'react-feather';
import toast, { Toaster } from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';

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

export default function BattleList() {
  const router = useRouter();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasNotifiedEmpty, setHasNotifiedEmpty] = useState<boolean>(false);
  const [candidateId, setCandidateId] = useState<string>('');

  // Decode candidate token to get candidateId
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token) as { id: string; role: string };
        setCandidateId(decoded.id);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchBattles() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          router.push('/login');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/battle', {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        setBattles(response.data);
      } catch (err: any) {
        setError('Failed to fetch battles.');
      } finally {
        setLoading(false);
      }
    }
    fetchBattles();
  }, [router]);

  // Show a toast notification once if there are no battles available.
  useEffect(() => {
    if (!loading && battles.length === 0 && !hasNotifiedEmpty) {
      toast('No battles available', { icon: 'ℹ️' });
      setHasNotifiedEmpty(true);
    }
  }, [loading, battles, hasNotifiedEmpty]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleJoin = async (battleId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please login.');
        router.push('/login');
        return;
      }
      const response = await axios.post(
        `http://localhost:8000/api/battle/join/${battleId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        router.push(`/battle/${battleId}`);
      } else {
        toast.error('Failed to join the battle.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error joining battle.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Battles</h1>
        {loading && <p>Loading battles...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && battles.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No battles available</p>
        )}
        <div className="space-y-4">
          {battles.map((battle) => {
            // Determine if the candidate has already joined this battle
            const isJoined = candidateId && battle.candidateJoins.includes(candidateId);
            return (
              <div
                key={battle._id}
                className="bg-gray-800 rounded-lg p-4 shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{battle.title}</h2>
                    <p className="text-sm">Recruiter: {battle.recruiter?.username}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleExpand(battle._id)}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Show details"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    {isJoined ? (
                      <button
                        onClick={() => router.push(`/battle/${battle._id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        Start
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(battle._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
                {expanded[battle._id] && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <p>
                      <strong>Job Description:</strong> {battle.jobDescription}
                    </p>
                    <p>
                      <strong>End Date:</strong> {new Date(battle.endDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Interview Duration:</strong> {battle.interviewDuration} minutes
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
