import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Clock, Calendar, CheckSquare } from 'lucide-react'
import CurvedLoop from '@/components/curved-loop'

export default function Home() {
  return (
    <div className="space-y-10 py-6">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Weekly Study Plan Worksheet
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-white/70">
          Plan your study schedule effectively, manage your time, and achieve your academic goals.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/planner">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link href="/pomodoro">
              Try Pomodoro Timer
            </Link>
          </Button>
        </div>
      </section>

      {/* Curved Loop Animation */}
      <section className="py-8 mb-16">
        <CurvedLoop 
          marqueeText="Study ✦ Plan ✦ Focus ✦ Achieve ✦ Success ✦" 
          speed={1.5}
          curveAmount={300}
          direction="right"
          interactive={true}
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-black border-white/20">
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2" />
            <CardTitle>Weekly Planning</CardTitle>
            <CardDescription className="text-white/70">
              Organize your week with a structured study plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80">
              Block off existing obligations, schedule your fun activities first, and mark important deadlines to create an effective study plan.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-white/20">
          <CardHeader>
            <Clock className="h-8 w-8 mb-2" />
            <CardTitle>Pomodoro Technique</CardTitle>
            <CardDescription className="text-white/70">
              Boost productivity with timed study sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80">
              Work in focused 25-minute sessions followed by short breaks to maintain concentration and prevent burnout.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CheckSquare className="h-8 w-8 mb-2" />
            <CardTitle>Goal Tracking</CardTitle>
            <CardDescription className="text-white/70">
              Set and monitor your academic goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80">
              Keep track of your current and upcoming goals, deadlines, and assignments to stay on top of your academic responsibilities.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle>Weekly Study Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Block off existing obligations this week</li>
                <li>Plan your fun first to help motivate your study time</li>
                <li>Clearly mark any due dates or assignment deadlines</li>
                <li>Focus on tasks not time, and be as specific as possible</li>
                <li>Use the pomodoro technique for focused study sessions</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-white/20">
            <CardHeader>
              <CardTitle>Pomodoro Technique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Decide on the task to be done</li>
                <li>Set a timer for 25 minutes</li>
                <li>Work on the task</li>
                <li>End work when the timer rings and put a checkmark</li>
                <li>Take a short break (3–5 minutes) if fewer than four checkmarks</li>
                <li>After four pomodoros, take a longer break (15–30 minutes)</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
