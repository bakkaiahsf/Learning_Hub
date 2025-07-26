'use client'

import { Star, Clock, BookOpen, User } from 'lucide-react'
import { LearningPath } from '@/lib/supabase'
import { memo, useMemo } from 'react'

interface LearningPathCardProps {
  path: LearningPath
  progress?: number
}

function LearningPathCard({ path, progress }: LearningPathCardProps) {
  const difficultyColor = useMemo(() => {
    switch (path.difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [path.difficulty])

  const iconColor = useMemo(() => {
    if (path.title.includes('Administrator')) return 'bg-blue-500'
    if (path.title.includes('Developer')) return 'bg-green-500'
    if (path.title.includes('Consultant')) return 'bg-purple-500'
    if (path.title.includes('Architect')) return 'bg-red-500'
    if (path.title.includes('Marketing')) return 'bg-orange-500'
    if (path.title.includes('Associate')) return 'bg-indigo-500'
    return 'bg-gray-500'
  }, [path.title])

  const displayedSkills = useMemo(() => path.key_skills.slice(0, 3), [path.key_skills])
  const remainingSkillsCount = useMemo(() => path.key_skills.length - 3, [path.key_skills.length])

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">{path.rating}</span>
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{path.description}</p>

      {/* Progress Bar (if progress is provided) */}
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Difficulty</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
            {path.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Duration</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{path.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Modules</span>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{path.modules_count} modules</span>
          </div>
        </div>
      </div>

      {/* Key Skills */}
      <div className="mb-6">
        <span className="text-sm text-gray-600 mb-2 block">Key Skills:</span>
        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{remainingSkillsCount} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => {
          // For MVP, this could navigate to a learning path detail page
          console.log(`Starting learning path: ${path.title}`)
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {progress !== undefined && progress > 0 ? 'Continue Learning' : 'Start Learning'}
      </button>
    </div>
  )
}

export default memo(LearningPathCard)

