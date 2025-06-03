"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"

interface GameOverScreenProps {
  score: number
  highScore: number
  defaultName: string
  onRestart: () => void
  onSubmitScore: (name: string) => void
  onViewLeaderboard: () => void
}

export default function GameOverScreen({
  score,
  highScore,
  defaultName,
  onRestart,
  onSubmitScore,
  onViewLeaderboard,
}: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState(defaultName)
  const [submitted, setSubmitted] = useState(false)
  const isNewHighScore = score > 0 && score >= highScore

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitScore(playerName)
    setSubmitted(true)
  }

  return (
    <div className="p-6 h-[620px] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-xs"
      >
        <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over</h2>

          <div className="mb-6">
            <p className="text-lg text-gray-700">Your Score</p>
            <p className="text-4xl font-bold text-sky-600">{score}</p>

            {isNewHighScore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm font-bold text-yellow-500"
              >
                NEW HIGH SCORE!
              </motion.div>
            )}

            <div className="mt-4 text-sm text-gray-600">High Score: {highScore}</div>

            <a
              href={`https://twitter.com/intent/post?text=I%20scored%20${score}%20points%20in%20Flappy%20HUDLer!%20Can%20you%20beat%20me%3F%0ATry%20here%3A%20&url=https%3A%2F%2Fflappy-huddler.vercel.app%2F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
            >
              Share on Twitter
            </a>
          </div>

        {score > 0 && !submitted && (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your name for the leaderboard:
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="Your name"
                maxLength={15}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors mb-2"
            >
              Submit Score
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors"
            onClick={onRestart}
          >
            Play Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors mt-2"
            onClick={onViewLeaderboard}
          >
            View Leaderboard
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors mt-2"
            onClick={() => onRestart()}
          >
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
