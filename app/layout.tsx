import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import { PomodoroProvider } from '@/contexts/pomodoro-context'
import TimerRestoreDialog from '@/components/timer-restore-dialog'
import FloatingTimer from '@/components/floating-timer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weekly Study Planner',
  description: 'Plan your study schedule effectively with our comprehensive weekly planner and Pomodoro timer.',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <PomodoroProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <TimerRestoreDialog />
          <FloatingTimer />
        </PomodoroProvider>
      </body>
    </html>
  )
}
