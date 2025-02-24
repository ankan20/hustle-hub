'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Info } from 'react-feather';
import toast, { Toaster } from 'react-hot-toast';
import { ExternalLinkIcon, Trophy, TrophyIcon } from 'lucide-react';

interface Battle {
  _id: string;
  title: string;
  jobDescription: string;
  endDate: string;
  interviewDuration: number;
  candidateCount: number;
  live: boolean;
}

interface LeaderboardEntry {
  candidate: {
    username: string;
  };
  score: number;
}

export default function RecruiterBattleList() {
  const router = useRouter();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [leaderboards, setLeaderboards] = useState<{ [key: string]: LeaderboardEntry[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
        const response = await axios.get('http://localhost:8000/api/battle/created', {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        setBattles(response.data);
      } catch (err: any) {
        setError('Failed to fetch your battles.');
      } finally {
        setLoading(false);
      }
    }
    fetchBattles();
  }, [router]);

  const toggleExpand = async (battleId: string) => {
    // Toggle expanded state
    setExpanded(prev => ({ ...prev, [battleId]: !prev[battleId] }));
    // If leaderboard not fetched yet and expanding, fetch it
    if (!expanded[battleId] && !leaderboards[battleId]) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found. Please login.');
          router.push('/login');
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/battle/leaderboard/${battleId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });
        setLeaderboards(prev => ({ ...prev, [battleId]: response.data }));
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch leaderboard.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Created Battles</h1>
        {loading && <p>Loading battles...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && battles.length === 0 && (
          <p className="text-center text-gray-400 mt-4">You haven't created any battles yet.</p>
        )}
        <div className="space-y-4">
          {battles.map(battle => (
            <div key={battle._id} className="bg-gray-800 rounded-lg p-4 shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{battle.title}</h2>
                  <p className="text-sm">
                    Status:{" "}
                    {battle.live ? (
                      <span className="text-green-400">Live</span>
                    ) : (
                      <span className="text-red-400">Ended</span>
                    )}
                  </p>
                  <p className="text-sm">Participants: {battle.candidateCount}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleExpand(battle._id)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    title="Show details & leaderboard"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {expanded[battle._id] && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <p className="mb-2">
                    <strong>Job Description:</strong> {battle.jobDescription}
                  </p>
                  <p className="mb-2">
                    <strong>End Date:</strong> {new Date(battle.endDate).toLocaleString()}
                  </p>
                  <p className="mb-4">
                    <strong>Interview Duration:</strong> {battle.interviewDuration} minutes
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Trophy className="mr-2 w-5 h-5" /> Leaderboard
                    </h3>
                    {leaderboards[battle._id] && leaderboards[battle._id].length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {leaderboards[battle._id].map((entry, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded shadow-sm text-sm"
                          >
                            <div className="flex items-center">
                              {index < 3 ? (
                                <TrophyIcon
                                  className={`mr-2 ${index === 0
                                      ? "text-yellow-500"
                                      : index === 1
                                        ? "text-gray-400"
                                        : "text-yellow-700"
                                    }`}
                                  size={20}
                                />
                              ) : (
                                <span className="mr-2 text-black">{index + 1}.</span>
                              )}
                              <div>
                                <span className="font-semibold text-black">
                                  {entry.candidate.username}
                                </span>
                                <span className="ml-1 text-black">
                                  - Overall Score: {Number(entry.score).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <a
                              href={`https://www.linkedin.com/in/${entry.candidate.username}`} // Adjust the link as needed
                              className="flex items-center text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="mr-1 text-sm">Visit</span>
                              <ExternalLinkIcon size={16} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No leaderboard data available.</p>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
