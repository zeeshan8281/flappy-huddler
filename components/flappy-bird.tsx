"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import CharacterSelection from "./character-selection"
import GameScreen from "./game-screen"
import GameOverScreen from "./game-over-screen"
import StartScreen from "./start-screen"
import LeaderboardScreen from "./leaderboard-screen"

export type GameState = "start" | "selection" | "playing" | "gameOver" | "leaderboard"
export type Character = {
  id: string
  name: string
  color: string
  jumpHeight: number
  fallSpeed: number
  moveSpeed: number
  size: number
}

export const characters: Character[] = [
  {
    id: "yellow",
    name: "Vanguard of Latency",
    color: "yellow",
    jumpHeight: 4,
    fallSpeed: 0.5,
    moveSpeed: 5,
    size: 30,
  },
  {
    id: "red",
    name: "Guardian of Privacy",
    color: "red",
    jumpHeight: 3.5,
    fallSpeed: 0.5,
    moveSpeed: 3,
    size: 28,
  },
  {
    id: "blue",
    name: "Sentinel of Uptime",
    color: "blue",
    jumpHeight: 4,
    fallSpeed: 0.3,
    moveSpeed: 2,
    size: 32,
  },
  {
    id: "green",
    name: "General of Open Access",
    color: "green",
    jumpHeight: 4.5,
    fallSpeed: 0.45,
    moveSpeed: 2.5,
    size: 25,
  },
]


export default function FlappyBird() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [playerName, setPlayerName] = useState("")
  const [pipes, setPipes] = useState<any[]>([])
  const [gameWidth, setGameWidth] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const savedHighScore = localStorage.getItem("flappyBirdHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    const savedName = localStorage.getItem("flappyBirdPlayerName")
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleStartGame = () => {
    setGameState("selection")
    playSound("start")
  }

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setGameState("playing")
    playSound("start")
  }

  const handleGameOver = (finalScore: number) => {
    let adjustedScore = finalScore
    if (selectedCharacter?.name === "Vanguard of Latency") {
      adjustedScore = finalScore * 3
    }
    setScore(adjustedScore)
    if (adjustedScore > highScore) {
      setHighScore(adjustedScore)
      localStorage.setItem("flappyBirdHighScore", adjustedScore.toString())
    }
    setGameState("gameOver")
    playSound("gameover")
  }

  const handleRestart = () => {
    setGameState("selection")
    setScore(0)
  }

  const handleViewLeaderboard = () => {
    setGameState("leaderboard")
  }

  const handleBackToMenu = () => {
    setGameState("start")
  }

  const handleUpdateGameData = useCallback((pipes: any[], gameWidth: number) => {
    setPipes((prevPipes) => {
      const pipesChanged =
        pipes.length !== prevPipes.length ||
        pipes.some((pipe, index) => {
          const prevPipe = prevPipes[index]
          return (
            !prevPipe ||
            pipe.x !== prevPipe.x ||
            pipe.topHeight !== prevPipe.topHeight ||
            pipe.passed !== prevPipe.passed
          )
        })
      if (pipesChanged) {
        return pipes
      }
      return prevPipes
    })

    setGameWidth((prevGameWidth) => {
      if (gameWidth !== prevGameWidth) {
        return gameWidth
      }
      return prevGameWidth
    })
  }, [])

  const handleSubmitScore = async (name: string) => {
    if (name.trim() === "") return

    localStorage.setItem("flappyBirdPlayerName", name)
    setPlayerName(name)

    const pipesPassedCount = pipes.filter(pipe => pipe.passed).length

    const gameData = {
      pipesPassed: pipesPassedCount,
      pipes,
      gameWidth,
    }

    console.log("Submitting gameData:", gameData)

    try {
      const response = await fetch("/api/leaderboard/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, gameData }),
      })

      if (response.ok) {
        setGameState("leaderboard")
      }
    } catch (error) {
      console.error("Failed to submit score:", error)
    }
  }

  const playSound = (sound: "jump" | "point" | "hit" | "start" | "gameover") => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio()

    switch (sound) {
      case "jump":
        audio.src = "/sounds/jump.mp3"
        break
      case "point":
        audio.src = "/sounds/point.mp3"
        break
      case "hit":
        audio.src = "/sounds/hit.mp3"
        break
      case "start":
        audio.src = "/sounds/start.mp3"
        break
      case "gameover":
        audio.src = "/sounds/gameover.mp3"
        break
    }

    audio.volume = 0.3
    audio.play().catch((e) => console.log("Audio play failed:", e))
    audioRef.current = audio
  }

  return (
    <div className="w-full max-w-md">
      <div className="relative bg-sky-100 border-4 border-sky-700 rounded-lg overflow-hidden shadow-xl">
        {gameState === "start" && <StartScreen onStart={handleStartGame} onLeaderboard={handleViewLeaderboard} />}

        {gameState === "selection" && <CharacterSelection characters={characters} onSelect={handleCharacterSelect} />}

        {gameState === "playing" && selectedCharacter && (
          <GameScreen
            character={selectedCharacter}
            onGameOver={handleGameOver}
            playSound={playSound}
            onUpdateGameData={handleUpdateGameData}
          />
        )}

        {gameState === "gameOver" && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            onRestart={handleRestart}
            onSubmitScore={handleSubmitScore}
            defaultName={playerName}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

        {gameState === "leaderboard" && <LeaderboardScreen onBack={handleBackToMenu} onHome={handleBackToMenu} />}
      </div>

      <div className="mt-4 text-center text-white text-sm"></div>
    </div>
  )
}
