'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import LearningPathCard from '@/components/LearningPathCard'
import { LearningPath } from '@/lib/supabase'
import { BookOpen, Filter, Search } from 'lucide-react'

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced'
type SortOption = 'rating' | 'title' | 'difficulty' | 'duration'

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating')

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch('/api/learning-paths')
      if (response.ok) {
        const data = await response.json()
        setLearningPaths(data)
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedPaths = () => {
    let filtered = learningPaths.filter((path) => {
      const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           path.key_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesDifficulty = difficultyFilter === 'all' || 
                               path.difficulty.toLowerCase() === difficultyFilter

      return matchesSearch && matchesDifficulty
    })

    // Sort paths
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return (difficultyOrder[a.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 4) - 
                 (difficultyOrder[b.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 4)
        case 'duration':
          // Extract hours from duration string and sort numerically
          const getHours = (duration: string) => {
            const match = duration.match(/(\d+)-?(\d+)?/)
            return match ? parseInt(match[1]) : 0
          }
          return getHours(a.duration) - getHours(b.duration)
        case 'rating':
        default:
          return b.rating - a.rating
      }
    })

    return filtered
  }

  const filteredPaths = filteredAndSortedPaths()
  const pathsByDifficulty = {
    beginner: learningPaths.filter(p => p.difficulty.toLowerCase() === 'beginner').length,
    intermediate: learningPaths.filter(p => p.difficulty.toLowerCase() === 'intermediate').length,
    advanced: learningPaths.filter(p => p.difficulty.toLowerCase() === 'advanced').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading learning paths...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Learning Paths</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive collection of structured learning journeys designed to take you 
            from beginner to expert in your chosen Salesforce specialty.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{learningPaths.length}</div>
            <div className="text-gray-600">Total Paths</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{pathsByDifficulty.beginner}</div>
            <div className="text-gray-600">Beginner</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{pathsByDifficulty.intermediate}</div>
            <div className="text-gray-600">Intermediate</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{pathsByDifficulty.advanced}</div>
            <div className="text-gray-600">Advanced</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search learning paths..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing {filteredPaths.length} of {learningPaths.length} learning paths
            </p>
          </div>
        </div>

        {/* Learning Paths Grid */}
        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaths.map((path, index) => (
              <LearningPathCard 
                key={path.id} 
                path={path}
                progress={index === 1 ? 25 : undefined} // Mock progress for demo
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No learning paths found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more learning paths.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setDifficultyFilter('all')
                setSortBy('rating')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Not sure which learning path is right for you? Take our skill assessment or speak with one of our learning advisors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Take Skill Assessment
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors">
              Speak with Advisor
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}