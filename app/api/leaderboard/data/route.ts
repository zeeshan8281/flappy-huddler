import { NextResponse } from "next/server"
import { query } from "../../../../lib/db"

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
    const leaderboard = result.rows.map(row => ({
      name: row.name,
      score: Number(row.score),
      date: row.date.toISOString()
    }))
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Error in GET /api/leaderboard/data:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
