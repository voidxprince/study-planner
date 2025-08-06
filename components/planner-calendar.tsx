'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'

interface Task {
  id: string
  title: string
  description: string
  date: string
  timeSlot: 'morning' | 'afternoon' | 'evening'
}

interface PlannerCalendarProps {
  currentWeek: Date
  onNavigateWeek: (direction: 'prev' | 'next') => void
}

export default function PlannerCalendar({ currentWeek, onNavigateWeek }: PlannerCalendarProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const isMobile = useMobile()

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeSlots = [
    { key: 'morning' as const, label: 'Morning' },
    { key: 'afternoon' as const, label: 'Afternoon' },
    { key: 'evening' as const, label: 'Evening' }
  ]

  const getWeekDates = (startDate: Date) => {
    return days.map((_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      return date
    })
  }

  const weekDates = getWeekDates(currentWeek)

  useEffect(() => {
    const savedTasks = localStorage.getItem('study-planner-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('study-planner-tasks', JSON.stringify(tasks))
  }, [tasks])

  const openDialog = (date?: string, timeSlot?: 'morning' | 'afternoon' | 'evening', task?: Task) => {
    if (task) {
      setEditingTask(task)
      setTaskTitle(task.title)
      setTaskDescription(task.description)
      setSelectedDate(task.date)
      setSelectedTimeSlot(task.timeSlot)
    } else {
      setEditingTask(null)
      setTaskTitle('')
      setTaskDescription('')
      setSelectedDate(date || weekDates[0].toISOString().split('T')[0])
      setSelectedTimeSlot(timeSlot || 'morning')
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
    setTaskTitle('')
    setTaskDescription('')
  }

  const saveTask = () => {
    if (!taskTitle.trim() || !selectedDate) return

    const taskData = {
      id: editingTask?.id || Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      date: selectedDate,
      timeSlot: selectedTimeSlot
    }

    if (editingTask) {
      setTasks(prev => prev.map(task => task.id === editingTask.id ? taskData : task))
    } else {
      setTasks(prev => [...prev, taskData])
    }

    closeDialog()
  }

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const getTasksForDateAndTime = (date: Date, timeSlot: string) => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.date === dateStr && task.timeSlot === timeSlot)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigateWeek('prev')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <h2 className="text-lg font-semibold">Study Planner</h2>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigateWeek('next')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Calendar Cards */}
        <div className="space-y-4">
          {weekDates.map((date, dayIndex) => (
            <Card key={dayIndex} className="bg-black border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {days[dayIndex]} - {formatDate(date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeSlots.map(({ key, label }) => {
                  const dayTasks = getTasksForDateAndTime(date, key)
                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="text-sm font-medium text-white/70">{label}</h4>
                      {dayTasks.length > 0 ? (
                        <div className="space-y-2">
                          {dayTasks.map(task => (
                            <div
                              key={task.id}
                              className="p-3 bg-white/5 border border-white/10 rounded-lg"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{task.title}</h5>
                                  {task.description && (
                                    <p className="text-xs text-white/70 mt-1">{task.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-white/60 hover:text-white"
                                    onClick={() => openDialog(undefined, undefined, task)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-white/60 hover:text-red-400"
                                    onClick={() => deleteTask(task.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 border border-dashed border-white/20 rounded-lg text-center text-white/50 text-sm">
                          No tasks scheduled
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Floating Add Button */}
        <Button
          onClick={() => openDialog()}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white text-black hover:bg-white/90 shadow-lg z-40"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Mobile Task Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white max-w-sm mx-4">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mobile-task-title">Task Title</Label>
                <Input
                  id="mobile-task-title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="mobile-task-description">Description (Optional)</Label>
                <Textarea
                  id="mobile-task-description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="bg-black border-white/20 text-white resize-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="mobile-task-date">Date</Label>
                <Input
                  id="mobile-task-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black border-white/20 text-white"
                />
              </div>

              <div>
                <Label>Time Slot</Label>
                <div className="flex gap-2 mt-2">
                  {timeSlots.map(({ key, label }) => (
                    <Button
                      key={key}
                      type="button"
                      variant={selectedTimeSlot === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeSlot(key)}
                      className={selectedTimeSlot === key 
                        ? "bg-white text-black" 
                        : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={saveTask}
                  disabled={!taskTitle.trim() || !selectedDate}
                  className="flex-1 bg-white text-black hover:bg-white/90"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
                <Button
                  onClick={closeDialog}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Desktop View
  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onNavigateWeek('prev')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Week
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onNavigateWeek('next')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Next Week
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="grid grid-cols-8 gap-4">
        {/* Time slots header */}
        <div className="space-y-4">
          <div className="h-12"></div>
          {timeSlots.map(({ label }) => (
            <div key={label} className="h-32 flex items-center">
              <span className="text-sm font-medium text-white/70 -rotate-90 whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDates.map((date, dayIndex) => (
          <div key={dayIndex} className="space-y-4">
            {/* Day header */}
            <div className="h-12 flex flex-col items-center justify-center bg-black border border-white/20 rounded-lg">
              <span className="text-sm font-medium">{days[dayIndex]}</span>
              <span className="text-xs text-white/70">{formatDate(date)}</span>
            </div>

            {/* Time slots for this day */}
            {timeSlots.map(({ key }) => {
              const dayTasks = getTasksForDateAndTime(date, key)
              return (
                <div
                  key={key}
                  className="h-32 bg-black border border-white/20 rounded-lg p-3 relative group overflow-hidden"
                >
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2 h-full overflow-y-auto">
                      {dayTasks.map(task => (
                        <div
                          key={task.id}
                          className="p-2 bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 rounded-md relative group/task hover:from-white/15 hover:via-white/8 hover:to-white/15 transition-all duration-200 h-full flex flex-col"
                          style={{
                            background: `
                              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%),
                              linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)
                            `,
                            backdropFilter: 'blur(1px)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-medium line-clamp-2 flex-1">{task.title}</h4>
                            <div className="flex gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity ml-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
                                onClick={() => openDialog(undefined, undefined, task)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-xs text-white/70 line-clamp-3 flex-1">{task.description}</p>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full h-full border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200 text-white/60 hover:text-white/80"
                      onClick={() => openDialog(date.toISOString().split('T')[0], key)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Desktop Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="bg-black border-white/20 text-white"
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="bg-black border-white/20 text-white"
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-date">Date</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black border-white/20 text-white"
                />
              </div>

              <div>
                <Label>Time Slot</Label>
                <div className="flex gap-1 mt-2">
                  {timeSlots.map(({ key, label }) => (
                    <Button
                      key={key}
                      type="button"
                      variant={selectedTimeSlot === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeSlot(key)}
                      className={selectedTimeSlot === key 
                        ? "bg-white text-black" 
                        : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={closeDialog}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={saveTask}
                disabled={!taskTitle.trim() || !selectedDate}
                className="bg-white text-black hover:bg-white/90"
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
