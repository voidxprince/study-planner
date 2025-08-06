'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePomodoro } from '@/contexts/pomodoro-context'
import { Clock, Play, RotateCcw } from 'lucide-react'

export default function TimerRestoreDialog() {
  const { restoreState, resetTimer } = usePomodoro()
  const [showDialog, setShowDialog] = useState(false)
  const [savedState, setSavedState] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-state')
    if (saved) {
      try {
        const parsedState = JSON.parse(saved)
        
        // Check if there was a running timer
        if (parsedState.isRunning && parsedState.startTime) {
          const now = Date.now()
          const elapsed = Math.floor((now - parsedState.startTime) / 1000)
          const remainingTime = Math.max(0, parsedState.timeLeft - elapsed)
          
          if (remainingTime > 0) {
            setSavedState({
              ...parsedState,
              timeLeft: remainingTime,
              isRunning: false, // Don't auto-resume
            })
            setShowDialog(true)
          }
        } else if (parsedState.timeLeft !== 1500 || parsedState.completedPomodoros > 0 || parsedState.sessions?.length > 0) {
          // Restore if there's any progress
          setSavedState(parsedState)
          setShowDialog(true)
        }
      } catch (error) {
        console.error('Failed to parse saved pomodoro state:', error)
      }
    }
  }, [])

  const handleContinue = () => {
    if (savedState) {
      restoreState(savedState)
    }
    setShowDialog(false)
  }

  const handleStartFresh = () => {
    resetTimer()
    localStorage.removeItem('pomodoro-state')
    setShowDialog(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'work':
        return 'Work Session'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Session'
    }
  }

  if (!showDialog || !savedState) return null

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="bg-black border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Resume Timer?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl font-bold mb-2">
              {formatTime(savedState.timeLeft)}
            </div>
            <div className="text-sm text-white/70">
              {getSessionLabel(savedState.currentSession)} remaining
            </div>
            {savedState.currentTask && (
              <div className="text-sm text-white/60 mt-2">
                Task: {savedState.currentTask}
              </div>
            )}
          </div>

          {savedState.completedPomodoros > 0 && (
            <div className="text-center text-sm text-white/70">
              Completed Pomodoros: {savedState.completedPomodoros}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleContinue}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              <Play className="h-4 w-4 mr-2" />
              Continue
            </Button>
            <Button
              onClick={handleStartFresh}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Fresh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
