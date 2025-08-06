'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePomodoro } from '@/contexts/pomodoro-context'
import { Clock, Play, Pause, Minimize2, Maximize2 } from 'lucide-react'

export default function FloatingTimer() {
  const pathname = usePathname()
  const { state, pauseTimer, resumeTimer } = usePomodoro()
  const [isMinimized, setIsMinimized] = useState(false)

  // Don't show on pomodoro page
  if (pathname === '/pomodoro') return null

  // Don't show if no active session and no completed pomodoros
  if (!state.isRunning && state.timeLeft === 1500 && state.completedPomodoros === 0) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'work':
        return 'Work'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Session'
    }
  }

  const getProgressPercentage = () => {
    const totalTime = state.currentSession === 'work' ? 1500 : 
                     state.currentSession === 'shortBreak' ? 300 : 1800
    return ((totalTime - state.timeLeft) / totalTime) * 100
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full bg-black border border-white/20 text-white hover:bg-white/10 shadow-lg"
          size="icon"
        >
          <Clock className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="bg-black border-white/20 shadow-lg min-w-[200px]">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-white/70">
              {getSessionLabel(state.currentSession)}
            </div>
            <div className="flex gap-1">
              <Button
                onClick={state.isRunning ? pauseTimer : resumeTimer}
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white/60 hover:text-white"
              >
                {state.isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                onClick={() => setIsMinimized(true)}
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white/60 hover:text-white"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-2">
            <div className="text-lg font-bold">
              {formatTime(state.timeLeft)}
            </div>
            {state.currentTask && (
              <div className="text-xs text-white/60 truncate">
                {state.currentTask}
              </div>
            )}
          </div>

          <div className="w-full bg-white/10 rounded-full h-1 mb-2">
            <div
              className="bg-white h-1 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-white/60">
            <span>Completed: {state.completedPomodoros}</span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-white/60 hover:text-white"
            >
              <Link href="/pomodoro">Open</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
