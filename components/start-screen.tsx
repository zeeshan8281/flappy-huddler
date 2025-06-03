"use client"

import { motion } from "framer-motion"
import { Bird } from "./bird"

interface StartScreenProps {
  onStart: () => void
  onLeaderboard: () => void
}

export default function StartScreen({ onStart, onLeaderboard }: StartScreenProps) {
  return (
    <div className="p-6 h-[500px] flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <Bird size={60} />
      </motion.div>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-white mb-8 text-center drop-shadow-md"
      >
        Flappy Legion 
      </motion.h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-colors text-xl"
          onClick={onStart}
        >
          Start Game
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors"
          onClick={onLeaderboard}
        >
          Leaderboard
        </motion.button>
      </div>

      <div className="mt-12 text-center text-white text-sm max-w-xs">
        <p className="mb-2 font-semibold">How to Play:</p>
        <p>Click, tap, or press space to make your Legion Hero jump and avoid obstacles!</p>
        <p className="mt-2">Choose from 4 different Heroes with unique abilities.</p>
      </div>
    </div>
  )
}
