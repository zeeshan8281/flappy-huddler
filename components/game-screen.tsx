"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Character } from "./flappy-bird"
import { Bird } from "./bird"

interface GameScreenProps {
  character: Character
  onGameOver: (score: number) => void
  playSound: (sound: "jump" | "point" | "hit" | "start" | "gameover") => void
  onUpdateGameData: (pipes: Pipe[], gameWidth: number) => void
}

interface Pipe {
  x: number
  topHeight: number
  passed: boolean
}

const GAME_HEIGHT = 500
const PIPE_WIDTH = 60
const PIPE_GAP = 150
const PIPE_SPACING = 200

export default function GameScreen({ character, onGameOver, playSound }: GameScreenProps) {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState<Pipe[]>([])
  const [score, setScore] = useState(0)
  const [gameWidth, setGameWidth] = useState(0)
  const gameRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const gameActive = useRef(true)

  // Get the game container width
  useEffect(() => {
    const updateGameWidth = () => {
      if (gameRef.current) {
        const width = gameRef.current.clientWidth
        setGameWidth(width)
        console.log("Game width set to:", width)
      }
    }

    // Call immediately and also on resize
    updateGameWidth()

    const handleResize = () => {
      updateGameWidth()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize pipes
  useEffect(() => {
    if (gameWidth > 0) {
      // Start with one pipe at the right edge of the screen
      const initialPipe = createPipe(gameWidth)
      setPipes([initialPipe])
      console.log("Initial pipe created at width:", gameWidth, "pipe:", initialPipe)
    }
  }, [gameWidth])

  // Game loop
  useEffect(() => {
    if (gameWidth === 0) return

    gameActive.current = true

    const gameLoop = (timestamp: number) => {
      if (!gameActive.current) return

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      // Update bird position
      const newVelocity = birdVelocity + character.fallSpeed * (deltaTime / 16)
      const newPosition = birdPosition + newVelocity

      // Check for collisions
      if (checkCollision(newPosition, pipes, character.size, gameWidth)) {
        playSound("hit")
        gameActive.current = false
        cancelAnimationFrame(frameRef.current)
        onGameOver(score)
        return
      }

      setBirdVelocity(newVelocity)
      setBirdPosition(newPosition)

      setPipes((prevPipes) => {
        const newPipes = [...prevPipes]
        let addPipe = false

        for (let i = 0; i < newPipes.length; i++) {
          newPipes[i] = {
            ...newPipes[i],
            x: newPipes[i].x - character.moveSpeed * (deltaTime / 16),
          }

          // Check if pipe is passed
          if (!newPipes[i].passed && newPipes[i].x + PIPE_WIDTH < gameWidth / 2 - character.size / 2) {
            newPipes[i].passed = true
            setScore((prev) => prev + 1)
            playSound("point")
          }

          // Check if we need to add a new pipe
          if (i === newPipes.length - 1 && newPipes[i].x < gameWidth - PIPE_SPACING) {
            addPipe = true
          }
        }

        // Remove pipes that are off screen
        const filteredPipes = newPipes.filter((pipe) => pipe.x + PIPE_WIDTH > -10)

        // Add new pipe if needed
        if (addPipe) {
          const newPipe = createPipe(gameWidth)
          filteredPipes.push(newPipe)
          console.log("New pipe added at x:", newPipe.x, "total pipes:", filteredPipes.length)
        }

        return filteredPipes
      })

      frameRef.current = requestAnimationFrame(gameLoop)
    }

    frameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      gameActive.current = false
      cancelAnimationFrame(frameRef.current)
    }
  }, [birdPosition, birdVelocity, character, gameWidth, score, onGameOver, playSound])

  // Jump handler
  const handleJump = useCallback(() => {
    setBirdVelocity(-character.jumpHeight)
    playSound("jump")
  }, [character.jumpHeight, playSound])

  // Add event listeners for jump
  useEffect(() => {
    const jumpHandler = () => handleJump()

    window.addEventListener("click", jumpHandler)
    window.addEventListener("touchstart", jumpHandler)

    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === "Space") jumpHandler()
    }

    window.addEventListener("keydown", keyHandler)

    return () => {
      window.removeEventListener("click", jumpHandler)
      window.removeEventListener("touchstart", jumpHandler)
      window.removeEventListener("keydown", keyHandler)
    }
  }, [handleJump])

  return (
    <div ref={gameRef} className="relative h-[500px] overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100">
      {/* Score */}
      <div className="absolute top-4 left-0 right-0 text-center z-50 px-2">
        <div className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md truncate">{score}</div>
      </div>

      {/* Instructional message */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-white text-sm select-none pointer-events-none">
        <p>Click or tap to make your hero jump!</p>
        <p>Each Hero has unique flying abilities. - choose wisely!</p>
      </div>

      {/* Bird */}
      <div
        className="absolute transition-transform"
        style={{
          width: character.size,
          height: character.size,
          top: birdPosition - character.size / 2,
          left: gameWidth / 2 - character.size / 2,
          transform: `rotate(${birdVelocity * 2}deg)`,
          zIndex: 10,
        }}
      >
        <Bird id={character.id} size={character.size} />
      </div>

      {/* Debug info */}
      {/* Pipe counter removed as per user request */}

      {/* Pipes */}
      {pipes.map((pipe, index) => (
        <div key={index} className="absolute" style={{ left: pipe.x, top: 0, height: GAME_HEIGHT, width: PIPE_WIDTH }}>
          {/* Top pipe */}
          <div
            className="absolute bg-green-500 border-r-4 border-l-4 border-t-4 border-green-700"
            style={{
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.topHeight,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-600 border-t-4 border-green-700" />
          </div>

          {/* Bottom pipe */}
          <div
            className="absolute bg-green-500 border-r-4 border-l-4 border-b-4 border-green-700"
            style={{
              top: pipe.topHeight + PIPE_GAP,
              width: PIPE_WIDTH,
              height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-green-600 border-b-4 border-green-700" />
          </div>
        </div>
      ))}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-yellow-600 to-yellow-700 border-t-4 border-yellow-800 z-20" />
    </div>
  )
}

// Helper functions
function createPipe(startX: number): Pipe {
  const minTopHeight = 50
  const maxTopHeight = GAME_HEIGHT - PIPE_GAP - 50
  const topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight + 1)) + minTopHeight

  return {
    x: startX, // This should be the right edge of the screen
    topHeight,
    passed: false,
  }
}

function checkCollision(birdY: number, pipes: Pipe[], birdSize: number, gameWidth: number): boolean {
  // Check if bird hits the ground or ceiling
  if (birdY - birdSize / 2 <= 0 || birdY + birdSize / 2 >= GAME_HEIGHT - 80) {
    return true
  }

  // Check if bird hits a pipe
  const birdLeft = gameWidth / 2 - birdSize / 2
  const birdRight = gameWidth / 2 + birdSize / 2

  for (const pipe of pipes) {
    const pipeLeft = pipe.x
    const pipeRight = pipe.x + PIPE_WIDTH

    // Check horizontal collision
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Check vertical collision with top pipe
      if (birdY - birdSize / 2 < pipe.topHeight) {
        return true
      }

      // Check vertical collision with bottom pipe
      if (birdY + birdSize / 2 > pipe.topHeight + PIPE_GAP) {
        return true
      }
    }
  }

  return false
}
