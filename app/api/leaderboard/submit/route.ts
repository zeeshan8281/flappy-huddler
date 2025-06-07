import { NextResponse } from "next/server"
import { query } from "../../../../lib/db"

// Server-side function to compute score from game data
function computeScore(gameData: any): number {
  // Validate gameData structure
  if (
    !gameData ||
    typeof gameData.pipesPassed !== "number" ||
    !Array.isArray(gameData.pipes) ||
    gameData.pipes.length === 0
  ) {
    return 0
  }

  // The bird's fixed horizontal position (center of the screen)
  // This should match the client-side game width / 2
  // We assume a fixed game width of 500 (from client code GAME_HEIGHT) or can be passed in gameData
  const birdX = gameData.gameWidth ? gameData.gameWidth / 2 : 250

  // Count how many pipes have been passed based on their x position relative to birdX
  // A pipe is considered passed if pipe.x + PIPE_WIDTH < birdX
  const PIPE_WIDTH = 60

  let validPipesPassedCount = 0
  for (const pipe of gameData.pipes) {
    if (
      typeof pipe.x !== "number" ||
      typeof pipe.topHeight !== "number" ||
      typeof pipe.passed !== "boolean"
    ) {
      // Invalid pipe data
      return 0
    }
    if (pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
      validPipesPassedCount++
    }
  }

  // Check if pipesPassed matches the counted valid pipes passed
  if (gameData.pipesPassed !== validPipesPassedCount) {
    return 0
  }

  // Score is the number of pipes passed
  return validPipesPassedCount
}

// Ensure the leaderboard table exists
async function ensureTable() {
  await query(
    "CREATE TABLE IF NOT EXISTS leaderboard (" +
    "id SERIAL PRIMARY KEY," +
    "name VARCHAR(255) NOT NULL," +
    "score INTEGER NOT NULL CHECK (score >= 0)," +
    "date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP" +
    ")"
  )
}

export async function POST(request: Request) {
  try {
    // Check origin header to allow only requests from flappyhudl.com
    const origin = request.headers.get("origin") || request.headers.get("referer") || ""
    if (!origin.includes("flappyhudl.com")) {
      return NextResponse.json({ error: "Forbidden: Invalid origin" }, { status: 403 })
    }

    const { name, gameData } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid input. Name is required." }, { status: 400 })
    }

    const score = computeScore(gameData)

    if (score <= 0) {
      return NextResponse.json({ error: "Invalid game data or score is zero." }, { status: 400 })
    }

    await ensureTable()
    const result = await query(
      "INSERT INTO leaderboard (name, score, date) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING name, score, date",
      [name, score]
    )
    return NextResponse.json({ success: true, entry: result.rows[0] })
  } catch (error) {
    console.error("Error in POST /api/leaderboard/submit:", error)
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 })
  }
}
