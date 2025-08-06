'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

interface Goal {
  id: string
  text: string
  completed: boolean
}

export default function GoalsList() {
  const [currentWeekGoals, setCurrentWeekGoals] = useState<Goal[]>([])
  const [nextWeekGoals, setNextWeekGoals] = useState<Goal[]>([])
  const [newCurrentGoal, setNewCurrentGoal] = useState('')
  const [newNextGoal, setNewNextGoal] = useState('')

  useEffect(() => {
    const savedCurrentGoals = localStorage.getItem('study-planner-current-goals')
    const savedNextGoals = localStorage.getItem('study-planner-next-goals')
    
    if (savedCurrentGoals) {
      setCurrentWeekGoals(JSON.parse(savedCurrentGoals))
    }
    if (savedNextGoals) {
      setNextWeekGoals(JSON.parse(savedNextGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('study-planner-current-goals', JSON.stringify(currentWeekGoals))
  }, [currentWeekGoals])

  useEffect(() => {
    localStorage.setItem('study-planner-next-goals', JSON.stringify(nextWeekGoals))
  }, [nextWeekGoals])

  const addGoal = (type: 'current' | 'next') => {
    const goalText = type === 'current' ? newCurrentGoal : newNextGoal
    if (!goalText.trim()) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      text: goalText.trim(),
      completed: false
    }

    if (type === 'current') {
      setCurrentWeekGoals(prev => [...prev, newGoal])
      setNewCurrentGoal('')
    } else {
      setNextWeekGoals(prev => [...prev, newGoal])
      setNewNextGoal('')
    }
  }

  const toggleGoal = (id: string, type: 'current' | 'next') => {
    if (type === 'current') {
      setCurrentWeekGoals(prev => 
        prev.map(goal => 
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      )
    } else {
      setNextWeekGoals(prev => 
        prev.map(goal => 
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      )
    }
  }

  const deleteGoal = (id: string, type: 'current' | 'next') => {
    if (type === 'current') {
      setCurrentWeekGoals(prev => prev.filter(goal => goal.id !== id))
    } else {
      setNextWeekGoals(prev => prev.filter(goal => goal.id !== id))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: 'current' | 'next') => {
    if (e.key === 'Enter') {
      addGoal(type)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-black border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Goals for This Week
            <span className="text-sm text-white/60">(include due dates and deadlines)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCurrentGoal}
              onChange={(e) => setNewCurrentGoal(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'current')}
              placeholder="Add a new goal..."
              className="bg-black border-white/20 text-white"
            />
            <Button
              onClick={() => addGoal('current')}
              disabled={!newCurrentGoal.trim()}
              size="icon"
              className="bg-white text-black hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {currentWeekGoals.map((goal, index) => (
              <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-sm text-white/60 min-w-[1.5rem]">{index + 1}.</span>
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id, 'current')}
                  className="border-white/20"
                />
                <span className={`flex-1 ${goal.completed ? 'line-through text-white/50' : ''}`}>
                  {goal.text}
                </span>
                <Button
                  onClick={() => deleteGoal(goal.id, 'current')}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white/60 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {currentWeekGoals.length === 0 && (
              <p className="text-white/50 text-center py-8">No goals set for this week</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Goals for Next Week
            <span className="text-sm text-white/60">(include upcoming due dates and deadlines)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newNextGoal}
              onChange={(e) => setNewNextGoal(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'next')}
              placeholder="Add a new goal..."
              className="bg-black border-white/20 text-white"
            />
            <Button
              onClick={() => addGoal('next')}
              disabled={!newNextGoal.trim()}
              size="icon"
              className="bg-white text-black hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {nextWeekGoals.map((goal, index) => (
              <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-sm text-white/60 min-w-[1.5rem]">{index + 1}.</span>
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id, 'next')}
                  className="border-white/20"
                />
                <span className={`flex-1 ${goal.completed ? 'line-through text-white/50' : ''}`}>
                  {goal.text}
                </span>
                <Button
                  onClick={() => deleteGoal(goal.id, 'next')}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white/60 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {nextWeekGoals.length === 0 && (
              <p className="text-white/50 text-center py-8">No goals set for next week</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
