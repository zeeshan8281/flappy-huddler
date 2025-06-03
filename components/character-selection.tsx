"use client"

import type { Character } from "./flappy-bird"
import { motion } from "framer-motion"
import { Bird } from "./bird"

interface CharacterSelectionProps {
  characters: Character[]
  onSelect: (character: Character) => void
}

export default function CharacterSelection({ characters, onSelect }: CharacterSelectionProps) {
  return (
    <div className="p-6 h-[500px] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-sky-800 mb-6">Choose Your HUDL Hero</h2>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {characters.map((character) => (
          <motion.button
            key={character.id}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(character)}
          >
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <Bird id={character.id} size={character.size} />
              </div>
            <h3 className="font-bold text-sky-800">{character.name}</h3>
            <div className="mt-2 grid grid-cols-3 gap-1 w-full">
              <Stat label="Jump" value={character.jumpHeight} max={10} />
              <Stat label="Speed" value={character.moveSpeed} max={5} />
              <Stat label="Size" value={character.size} max={35} reverse />
            </div>
          </motion.button>
        ))}
      </div>

      {/* <p className="mt-8 text-sm text-sky-700 text-center max-w-md px-4" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>
        Each Hero has unique flying abilities.
        <br />
        Choose the one that matches your play style!
      </p> */}
    </div>
  )
}

function Stat({
  label,
  value,
  max,
  reverse = false,
}: { label: string; value: number; max: number; reverse?: boolean }) {
  const percentage = (value / max) * 100
  const displayValue = reverse ? max - value + 1 : value

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
