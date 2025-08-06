'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

interface PomodoroSession {
  id: string
  task: string
  completedAt: Date
  type: 'work' | 'shortBreak' | 'longBreak'
}

interface PomodoroState {
  isRunning: boolean
  timeLeft: number
  currentSession: 'work' | 'shortBreak' | 'longBreak'
  completedPomodoros: number
  currentTask: string
  sessions: PomodoroSession[]
  startTime: number | null
}

type PomodoroAction =
  | { type: 'START_TIMER'; task: string }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SET_TASK'; task: string }
  | { type: 'RESTORE_STATE'; state: Partial<PomodoroState> }

const WORK_TIME = 25 * 60 // 25 minutes
const SHORT_BREAK_TIME = 5 * 60 // 5 minutes
const LONG_BREAK_TIME = 30 * 60 // 30 minutes

const initialState: PomodoroState = {
  isRunning: false,
  timeLeft: WORK_TIME,
  currentSession: 'work',
  completedPomodoros: 0,
  currentTask: '',
  sessions: [],
  startTime: null,
}

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        currentTask: action.task,
        startTime: Date.now(),
      }
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false,
      }
    
    case 'RESUME_TIMER':
      return {
        ...state,
        isRunning: true,
        startTime: Date.now() - (getSessionDuration(state.currentSession) - state.timeLeft) * 1000,
      }
    
    case 'RESET_TIMER':
      return {
        ...initialState,
        sessions: state.sessions,
      }
    
    case 'TICK':
      if (state.timeLeft <= 1) {
        return {
          ...state,
          timeLeft: 0,
          isRunning: false,
        }
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      }
    
    case 'COMPLETE_SESSION':
      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        task: state.currentTask,
        completedAt: new Date(),
        type: state.currentSession,
      }
      
      let nextSession: 'work' | 'shortBreak' | 'longBreak'
      let nextTimeLeft: number
      let newCompletedPomodoros = state.completedPomodoros
      
      if (state.currentSession === 'work') {
        newCompletedPomodoros += 1
        if (newCompletedPomodoros % 4 === 0) {
          nextSession = 'longBreak'
          nextTimeLeft = LONG_BREAK_TIME
        } else {
          nextSession = 'shortBreak'
          nextTimeLeft = SHORT_BREAK_TIME
        }
      } else {
        nextSession = 'work'
        nextTimeLeft = WORK_TIME
      }
      
      return {
        ...state,
        currentSession: nextSession,
        timeLeft: nextTimeLeft,
        completedPomodoros: newCompletedPomodoros,
        sessions: [...state.sessions, newSession],
        isRunning: false,
        startTime: null,
      }
    
    case 'SET_TASK':
      return {
        ...state,
        currentTask: action.task,
      }
    
    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.state,
      }
    
    default:
      return state
  }
}

function getSessionDuration(session: 'work' | 'shortBreak' | 'longBreak'): number {
  switch (session) {
    case 'work':
      return WORK_TIME
    case 'shortBreak':
      return SHORT_BREAK_TIME
    case 'longBreak':
      return LONG_BREAK_TIME
  }
}

interface PomodoroContextType {
  state: PomodoroState
  startTimer: (task: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  completeSession: () => void
  setTask: (task: string) => void
  restoreState: (state: Partial<PomodoroState>) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState)

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      ...state,
      startTime: state.isRunning ? state.startTime : null,
    }
    localStorage.setItem('pomodoro-state', JSON.stringify(stateToSave))
  }, [state])

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isRunning, state.timeLeft])

  // Handle session completion
  useEffect(() => {
    if (state.timeLeft === 0 && !state.isRunning) {
      // Play completion sound
      const audio = new Audio('/alarm.mp3')
      audio.play().catch(() => {
        // Handle audio play failure silently
      })
      
      dispatch({ type: 'COMPLETE_SESSION' })
    }
  }, [state.timeLeft, state.isRunning])

  const startTimer = (task: string) => {
    dispatch({ type: 'START_TIMER', task })
  }

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' })
  }

  const resumeTimer = () => {
    dispatch({ type: 'RESUME_TIMER' })
  }

  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' })
  }

  const completeSession = () => {
    dispatch({ type: 'COMPLETE_SESSION' })
  }

  const setTask = (task: string) => {
    dispatch({ type: 'SET_TASK', task })
  }

  const restoreState = (restoredState: Partial<PomodoroState>) => {
    dispatch({ type: 'RESTORE_STATE', state: restoredState })
  }

  return (
    <PomodoroContext.Provider
      value={{
        state,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        completeSession,
        setTask,
        restoreState,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider')
  }
  return context
}
