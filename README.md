# Flappy Legion

Flappy Legion is a modern, web-based Flappy Bird-inspired game built with React and Next.js. It features multiple unique characters, a global leaderboard, and responsive design for an engaging user experience across devices.

## Features

- Classic Flappy Bird gameplay with unique characters, each having distinct flying abilities.
- Score multiplier for special characters (e.g., "Sentinel of Uptime").
- Global leaderboard with real-time score submission and ranking.
- Responsive UI optimized for desktop and mobile devices.
- Instructional messages to guide players during gameplay.
- Persistent high score tracking using local storage.
- Smooth animations and sound effects for an immersive experience.
- Footer branding visible on all pages.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or pnpm package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd flappy-bird
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to play the game.

## Project Structure

- `app/` - Next.js app directory containing global styles and layout.
- `components/` - React components for game screens, UI elements, and game logic.
- `lib/` - Utility functions and database interaction.
- `public/assets/` - Static assets including images and SVGs.
- `app/api/leaderboard/` - API route for leaderboard data handling.

## Gameplay

- Click, tap, or press space to make your selected hero jump.
- Avoid obstacles and score points by passing through pipes.
- Special characters may have score multipliers or unique abilities.
- Submit your score to the global leaderboard after game over.

## Customization

- Add new characters by updating the `components/character-selection.tsx` and related logic.
- Modify game parameters such as pipe spacing, bird jump height, and fall speed in `components/game-screen.tsx`.
- Update UI styles using Tailwind CSS classes in component files.

## Environment Variables

- Configure any necessary environment variables for API endpoints or database connections in `.env.local`.

## Testing

- Manual testing is recommended for gameplay mechanics, UI responsiveness, and API functionality.
- Use browser developer tools to monitor network requests and console logs.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, features, or improvements.

## License

This project is licensed under the MIT License.

---

Made with 💙 by Huddle01
