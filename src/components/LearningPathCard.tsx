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
        return 'bg-success/10 text-success border border-success/20'
      case 'intermediate':
        return 'bg-warning/10 text-warning border border-warning/20'
      case 'advanced':
        return 'bg-error/10 text-error border border-error/20'
      default:
        return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
    }
  }, [path.difficulty])

  const iconColor = useMemo(() => {
    if (path.title.includes('Administrator')) return 'bg-gradient-to-br from-primary-500 to-primary-600'
    if (path.title.includes('Developer')) return 'bg-gradient-to-br from-success/80 to-success'
    if (path.title.includes('Consultant')) return 'bg-gradient-to-br from-accent-500 to-accent-600'
    if (path.title.includes('Architect')) return 'bg-gradient-to-br from-error/80 to-error'
    if (path.title.includes('Marketing')) return 'bg-gradient-to-br from-warning/80 to-warning'
    if (path.title.includes('Associate')) return 'bg-gradient-to-br from-primary-400 to-primary-500'
    return 'bg-gradient-to-br from-neutral-500 to-neutral-600'
  }, [path.title])

  const displayedSkills = useMemo(() => path.key_skills.slice(0, 3), [path.key_skills])
  const remainingSkillsCount = useMemo(() => path.key_skills.length - 3, [path.key_skills.length])

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-7 hover:shadow-large transition-all duration-300 group hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className={`p-3 rounded-xl ${iconColor} shadow-medium`}>
          <User className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center space-x-1 bg-neutral-50 px-3 py-1.5 rounded-full">
          <Star className="h-4 w-4 text-warning fill-current" />
          <span className="text-sm font-semibold text-neutral-700">{path.rating}</span>
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">{path.title}</h3>
      <p className="text-neutral-600 mb-5 line-clamp-3 leading-relaxed">{path.description}</p>

      {/* Progress Bar (if progress is provided) */}
      {progress !== undefined && (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600 font-medium">Progress</span>
            <span className="text-sm font-semibold text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 font-medium">Difficulty</span>
          <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${difficultyColor}`}>
            {path.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 font-medium">Duration</span>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-700 font-medium">{path.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 font-medium">Modules</span>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-700 font-medium">{path.modules_count} modules</span>
          </div>
        </div>
      </div>

      {/* Key Skills */}
      <div className="mb-7">
        <span className="text-sm text-neutral-600 mb-3 block font-medium">Key Skills:</span>
        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((skill, index) => (
            <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200">
              +{remainingSkillsCount} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => {
          console.log(`Starting learning path: ${path.title}`)
        }}
        className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 cursor-pointer"
      >
        {progress !== undefined && progress > 0 ? 'Continue Learning' : 'Start Learning'}
      </button>
    </div>
  )
}

export default memo(LearningPathCard)

