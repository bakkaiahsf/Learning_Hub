'use client'

import { useState, useEffect, useRef } from 'react'
import { Target, ChevronDown, Check } from 'lucide-react'

interface PurposeOption {
  id: string
  name: string
  description: string
  icon: string
}

interface LearningPurposeSelectorProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

const LEARNING_PURPOSES: PurposeOption[] = [
  {
    id: 'certification_prep',
    name: 'Certification Preparation',
    description: 'Get ready for Salesforce certification exams',
    icon: '🏆'
  },
  {
    id: 'job_interview',
    name: 'Job Interview Prep',
    description: 'Prepare for Salesforce job interviews and technical questions',
    icon: '💼'
  },
  {
    id: 'project_implementation',
    name: 'Project Implementation',
    description: 'Learn to implement specific Salesforce solutions',
    icon: '🚀'
  },
  {
    id: 'skill_development',
    name: 'Skill Development',
    description: 'Enhance existing Salesforce skills and knowledge',
    icon: '📈'
  },
  {
    id: 'career_switch',
    name: 'Career Transition',
    description: 'Transition into a Salesforce career from another field',
    icon: '🔄'
  },
  {
    id: 'solution_design',
    name: 'Solution Design',
    description: 'Learn to architect and design Salesforce solutions',
    icon: '🎯'
  }
]

export default function LearningPurposeSelector({
  value = '',
  onChange,
  label = '🎯 Your Learning Goal',
  className = ''
}: LearningPurposeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeOption | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const purpose = LEARNING_PURPOSES.find(p => p.id === value)
      setSelectedPurpose(purpose || null)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (purpose: PurposeOption) => {
    setSelectedPurpose(purpose)
    onChange(purpose.id)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-left flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {selectedPurpose ? (
            <>
              <span className="text-lg">{selectedPurpose.icon}</span>
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  {selectedPurpose.name}
                </div>
                <div className="text-xs text-neutral-600">
                  {selectedPurpose.description}
                </div>
              </div>
            </>
          ) : (
            <>
              <Target className="h-5 w-5 text-neutral-400" />
              <span className="text-sm text-neutral-500">Select your learning goal</span>
            </>
          )}
        </div>
        
        <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-large overflow-hidden">
          <div className="py-2">
            {LEARNING_PURPOSES.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => handleSelect(purpose)}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{purpose.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 group-hover:text-primary-700">
                      {purpose.name}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {purpose.description}
                    </div>
                  </div>
                </div>
                
                {selectedPurpose?.id === purpose.id && (
                  <Check className="h-4 w-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}