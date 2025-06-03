import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flappy Huddler',
  description: '',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        <div className="flex-grow">{children}</div>
        <footer className="w-full bg-sky-100 border-t border-sky-300 py-2 text-center flex items-center justify-center gap-2 text-sm text-sky-800 select-none fixed bottom-0 left-0">
          <span>Made with 💙 by</span>
          <img
            src="/assets/Huddle01-Product--ForLightBG (1).svg"
            alt="Huddle Logo"
            className="inline-block h-6 w-auto"
          />
        </footer>
      </body>
    </html>
  )
}
