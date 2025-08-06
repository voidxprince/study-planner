'use client'

import { useState } from 'react'
import PlannerCalendar from '@/components/planner-calendar'
import GoalsList from '@/components/goals-list'

export default function PlannerPage() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    return monday
  })

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev)
      newWeek.setDate(prev.getDate() + (direction === 'next' ? 7 : -7))
      return newWeek
    })
  }

  const formatWeekRange = (date: Date) => {
    const monday = new Date(date)
    const sunday = new Date(date)
    sunday.setDate(monday.getDate() + 6)
    
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Study Plan for Week of {formatWeekRange(currentWeek)}
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Plan your weekly study schedule by adding tasks to specific days and time slots. 
          Set your goals and track your progress throughout the week.
        </p>
      </div>

      <PlannerCalendar 
        currentWeek={currentWeek}
        onNavigateWeek={navigateWeek}
      />

      <GoalsList />
    </div>
  )
}
