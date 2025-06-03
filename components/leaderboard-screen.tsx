"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

interface LeaderboardScreenProps {
  onBack: () => void
  onHome: () => void
}

export default function LeaderboardScreen({ onBack, onHome }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }
        const data = await response.json()
        setLeaderboard(data.leaderboard)
        setLoading(false)
      } catch (err) {
        setError("Failed to load leaderboard. Please try again later.")
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="p-6 h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-sky-800 mb-4 text-center">Global Leaderboard</h2>

      <div className="flex-1 overflow-y-auto mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No scores yet. Be the first to submit your score!</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={index === 0 ? "bg-yellow-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {index === 0 ? (
                          <span className="text-yellow-500 font-bold">🏆 1st</span>
                        ) : index === 1 ? (
                          <span className="text-gray-500 font-bold">🥈 2nd</span>
                        ) : index === 2 ? (
                          <span className="text-amber-600 font-bold">🥉 3rd</span>
                        ) : (
                          `${index + 1}th`
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-bold">{entry.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.date)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center flex-col items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors"
          onClick={onBack}
        >
          Back to Menu
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors"
          onClick={onHome}
        >
          Home
        </motion.button>
      </div>
    </div>
  )
}
