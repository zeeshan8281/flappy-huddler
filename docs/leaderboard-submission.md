# Leaderboard Submission API Usage

## Overview

This document explains how to submit scores to the Flappy Bird leaderboard API with proper validation to prevent fake or invalid entries.

## Endpoints

### 1. Fetch Leaderboard

- **GET** `/api/leaderboard`
- Returns the top leaderboard entries.
- No submission functionality here.

### 2. Submit Score (Validated)

- **POST** `/api/leaderboard/submit`
- This endpoint requires the following JSON payload:

```json
{
  "name": "playerName",
  "gameData": {
    "pipesPassed": number,
    "pipes": [
      {
        "x": number,
        "topHeight": number,
        "passed": boolean
      },
      ...
    ],
    "gameWidth": number
  }
}
```

- The server validates the `gameData` to ensure the score is consistent with the game state.
- Invalid or fake submissions will be rejected with a 400 error.

### 3. Submit Score (Unvalidated - Deprecated)

- **POST** `/api/leaderboard`
- Accepts simple `{ "name": string, "score": number }` payload.
- Does **not** perform validation.
- Usage of this endpoint for submissions is discouraged.

## Recommendation

- Always use `/api/leaderboard/submit` for submitting scores.
- Ensure your client sends the full `gameData` object for validation.
- Avoid using `/api/leaderboard` POST endpoint for submissions.

## Example Submission with curl

```bash
curl -X POST https://yourdomain.com/api/leaderboard/submit \\
-H "Content-Type: application/json" \\
-d '{
  "name": "player1",
  "gameData": {
    "pipesPassed": 10,
    "pipes": [
      {"x": 100, "topHeight": 120, "passed": true},
      {"x": 200, "topHeight": 130, "passed": false}
    ],
    "gameWidth": 500
  }
}'
```

## Error Handling

- If the submission is invalid, the server responds with:

```json
{
  "error": "Invalid game data or score is zero."
}
```

- Ensure your client handles these errors gracefully.

---

For any questions or issues, please contact the development team.
