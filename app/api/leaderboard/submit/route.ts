import { NextResponse } from "next/server"
import { query } from "../../../../lib/db"

// Server-side function to compute score from game data
function computeScore(gameData: any): number {
  // Example: compute score based on number of pipes passed or other game metrics
  // This function should be adapted to the actual game data structure
  if (!gameData || typeof gameData.pipesPassed !== "number") {
    return 0
  }
  return gameData.pipesPassed
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
