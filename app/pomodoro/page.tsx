'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePomodoro } from '@/contexts/pomodoro-context'
import { Play, Pause, RotateCcw, Clock, CheckCircle } from 'lucide-react'

export default function PomodoroPage() {
  const { state, startTimer, pauseTimer, resumeTimer, resetTimer } = usePomodoro()
  const [taskInput, setTaskInput] = useState('')

  useEffect(() => {
    setTaskInput(state.currentTask)
  }, [state.currentTask])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionTitle = () => {
    switch (state.currentSession) {
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

  const getSessionDescription = () => {
    switch (state.currentSession) {
      case 'work':
        return 'Focus on your task and avoid distractions'
      case 'shortBreak':
        return 'Take a short break to recharge'
      case 'longBreak':
        return 'Take a longer break - you\'ve earned it!'
      default:
        return ''
    }
  }

  const getProgressPercentage = () => {
    const totalTime = state.currentSession === 'work' ? 1500 : 
                     state.currentSession === 'shortBreak' ? 300 : 1800
    return ((totalTime - state.timeLeft) / totalTime) * 100
  }

  const handleStartResume = () => {
    if (state.isRunning) {
      pauseTimer()
    } else if (state.timeLeft < (state.currentSession === 'work' ? 1500 : state.currentSession === 'shortBreak' ? 300 : 1800)) {
      resumeTimer()
    } else {
      startTimer(taskInput)
    }
  }

  const getTodaySessions = () => {
    const today = new Date().toDateString()
    return state.sessions.filter(session => 
      new Date(session.completedAt).toDateString() === today
    )
  }

  const todaySessions = getTodaySessions()
  const todayWorkSessions = todaySessions.filter(s => s.type === 'work').length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Pomodoro Timer
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Use the Pomodoro Technique to boost your productivity. Work for 25 minutes, then take a 5-minute break.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Timer */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                {getSessionTitle()}
              </CardTitle>
              <p className="text-white/70">{getSessionDescription()}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  {formatTime(state.timeLeft)}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Task Input */}
              <div className="space-y-2">
                <Label htmlFor="task">Current Task</Label>
                <Input
                  id="task"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="What are you working on?"
                  className="bg-black border-white/20 text-white"
                  disabled={state.isRunning}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStartResume}
                  disabled={!taskInput.trim() && !state.isRunning && state.timeLeft === (state.currentSession === 'work' ? 1500 : state.currentSession === 'shortBreak' ? 300 : 1800)}
                  className="bg-white text-black hover:bg-white/90"
                >
                  {state.isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {state.timeLeft < (state.currentSession === 'work' ? 1500 : state.currentSession === 'shortBreak' ? 300 : 1800) ? 'Resume' : 'Start'}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pomodoro Technique Info */}
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle>How the Pomodoro Technique Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Decide on the task to be done</li>
                <li>Set a timer for 25 minutes</li>
                <li>Work on the task</li>
                <li>End work when the timer rings and put a checkmark</li>
                <li>If you have fewer than four checkmarks, take a short break (3–5 minutes)</li>
                <li>After four pomodoros, take a longer break (15–30 minutes)</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Current Stats */}
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{todayWorkSessions}</div>
                <div className="text-sm text-white/70">Completed Pomodoros</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{state.completedPomodoros}</div>
                <div className="text-sm text-white/70">Session Streak</div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium truncate">{session.task}</div>
                      <div className="text-xs text-white/60">
                        {new Date(session.completedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className="text-xs text-white/60 capitalize">
                      {session.type === 'work' ? 'Work' : session.type === 'shortBreak' ? 'Break' : 'Long Break'}
                    </div>
                  </div>
                ))}
                
                {todaySessions.length === 0 && (
                  <div className="text-center text-white/50 py-4">
                    No sessions completed today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
