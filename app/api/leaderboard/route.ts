import { NextResponse } from "next/server"
import { query } from "../../../lib/db"

// Ensure the leaderboard table exists
async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 0),
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await query("SELECT name, score, date FROM leaderboard ORDER BY score DESC, date ASC LIMIT 10")
    // Fix: Ensure the rows are properly formatted as JSON array
    const leaderboard = result.rows.map(row => ({
      name: row.name,
      score: Number(row.score),
      date: row.date.toISOString()
    }))
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, score } = await request.json()

    if (!name || typeof score !== "number" || score < 0) {
      return NextResponse.json({ error: "Invalid input. Name and positive score are required." }, { status: 400 })
    }

    await ensureTable()
    const result = await query(
      "INSERT INTO leaderboard (name, score, date) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING name, score, date",
      [name, score]
    )
    return NextResponse.json({ success: true, entry: result.rows[0] })
  } catch (error) {
    console.error("Error in POST /api/leaderboard:", error)
    return NextResponse.json({ error: "Failed to add score to leaderboard" }, { status: 500 })
  }
}
