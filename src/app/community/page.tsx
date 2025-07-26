'use client'

import Header from '@/components/Header'
import { Users, MessageCircle, Heart, Share2, Calendar, Trophy } from 'lucide-react'

export default function CommunityPage() {
  const discussions = [
    {
      id: '1',
      title: 'Best practices for Lightning Web Component development',
      author: 'Sarah Chen',
      avatar: '👩‍💻',
      replies: 23,
      likes: 45,
      timeAgo: '2 hours ago',
      category: 'Development',
      isAnswered: true
    },
    {
      id: '2',
      title: 'How to optimize SOQL queries for better performance?',
      author: 'Mike Rodriguez',
      avatar: '👨‍💼',
      replies: 18,
      likes: 32,
      timeAgo: '4 hours ago',
      category: 'Performance',
      isAnswered: false
    },
    {
      id: '3',
      title: 'Sharing my Admin certification journey and tips',
      author: 'Emma Johnson',
      avatar: '👩‍🎓',
      replies: 67,
      likes: 156,
      timeAgo: '1 day ago',
      category: 'Certification',
      isAnswered: false
    }
  ]

  const events = [
    {
      id: '1',
      title: 'Virtual Salesforce Developer Meetup',
      date: 'Feb 15, 2024',
      time: '6:00 PM EST',
      attendees: 247,
      type: 'Virtual'
    },
    {
      id: '2',
      title: 'Admin Certification Study Group',
      date: 'Feb 18, 2024',
      time: '7:00 PM EST',
      attendees: 89,
      type: 'Study Group'
    }
  ]

  const leaderboard = [
    { name: 'Alex Thompson', avatar: '👨‍🚀', points: 2340, badge: 'Expert' },
    { name: 'Lisa Wang', avatar: '👩‍💻', points: 1890, badge: 'Mentor' },
    { name: 'David Kim', avatar: '👨‍💼', points: 1654, badge: 'Contributor' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Community</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow Salesforce learners, share knowledge, get help, and grow together 
            in our vibrant community.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15,234</div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3,456</div>
            <div className="text-gray-600">Discussions</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">28,901</div>
            <div className="text-gray-600">Answers</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
            <div className="text-gray-600">Experts</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Discussions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Discussion
                </button>
              </div>
              
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{discussion.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {discussion.title}
                          </h3>
                          {discussion.isAnswered && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Answered
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>by {discussion.author}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {discussion.category}
                          </span>
                          <span>{discussion.timeAgo}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{discussion.replies}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{discussion.likes}</span>
                          </div>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{event.date} at {event.time}</p>
                            <p>{event.attendees} attending • {event.type}</p>
                          </div>
                        </div>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Top Contributors */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Top Contributors</h2>
              </div>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.points} points</div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {user.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Community Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be respectful and supportive</li>
                <li>• Search before posting</li>
                <li>• Use clear, descriptive titles</li>
                <li>• Mark helpful answers</li>
                <li>• Share knowledge freely</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ask Question
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Share Experience
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Find Study Buddy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}