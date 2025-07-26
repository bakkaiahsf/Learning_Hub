'use client'

import Header from '@/components/Header'
import { BookOpen, Clock, Trophy, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  // Mock user data - in real app, this would come from API/Supabase
  const userStats = {
    completedModules: 12,
    totalModules: 45,
    studyStreak: 7,
    certificationsEarned: 2,
    hoursLearned: 34,
    weeklyGoal: 8
  }

  const recentActivity = [
    { id: '1', type: 'completed', title: 'Apex Programming Basics', time: '2 hours ago' },
    { id: '2', type: 'started', title: 'Lightning Web Components', time: '1 day ago' },
    { id: '3', type: 'achievement', title: 'Earned Admin Certification', time: '3 days ago' }
  ]

  const currentLearningPaths = [
    {
      id: '1',
      title: 'Platform Developer',
      progress: 45,
      nextModule: 'Advanced Apex Patterns',
      estimatedCompletion: '2 weeks'
    },
    {
      id: '2',
      title: 'Sales Cloud Consultant',
      progress: 20,
      nextModule: 'Lead Management',
      estimatedCompletion: '1 month'
    }
  ]

  const upcomingDeadlines = [
    { id: '1', title: 'Platform Developer I Exam', date: '2024-02-15', type: 'exam' },
    { id: '2', title: 'Lightning Components Assignment', date: '2024-02-10', type: 'assignment' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
            <p className="text-gray-600">Here's your learning progress and what's coming up next.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.completedModules}</div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.studyStreak}</div>
                  <div className="text-sm text-gray-600">Day Study Streak</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.certificationsEarned}</div>
                  <div className="text-sm text-gray-600">Certifications</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.hoursLearned}h</div>
                  <div className="text-sm text-gray-600">Hours This Month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Progress */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Current Learning Paths</h2>
                <div className="space-y-6">
                  {currentLearningPaths.map((path) => (
                    <div key={path.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{path.title}</h3>
                        <span className="text-sm text-gray-600">{path.progress}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Next: {path.nextModule}</span>
                        <span>Est. completion: {path.estimatedCompletion}</span>
                      </div>
                      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goal */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Learning Goal</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Study Hours</span>
                      <span className="font-medium">{userStats.hoursLearned}/{userStats.weeklyGoal} hours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((userStats.hoursLearned / userStats.weeklyGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {userStats.hoursLearned >= userStats.weeklyGoal 
                    ? "🎉 Great job! You&apos;ve met your weekly goal!" 
                    : `${userStats.weeklyGoal - userStats.hoursLearned} hours left to reach your goal`}
                </p>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'completed' ? 'bg-green-100' :
                        activity.type === 'started' ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                        {activity.type === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {activity.type === 'started' && <BookOpen className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'achievement' && <Trophy className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-600">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{deadline.title}</div>
                        <div className="text-xs text-gray-600">{deadline.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Resume Learning
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Take Practice Test
                  </button>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Schedule Study Time
                  </button>
                  <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    View All Courses
                  </button>
                </div>
              </div>

              {/* Study Streak */}
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold mb-1">{userStats.studyStreak} Days</div>
                  <div className="text-orange-100 text-sm mb-4">Study Streak</div>
                  <div className="text-xs text-orange-100">
                    Keep it up! Study today to maintain your streak.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}