'use client'

import { useEffect, useState, memo } from 'react'
import { supabase, LearningPath } from '@/lib/supabase'
import LearningPathCard from './LearningPathCard'

function LearningPathsSection() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths) // Start with mock data
  const [loading, setLoading] = useState(false) // Don't show loading initially

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        // Set a shorter timeout to prevent hanging requests  
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000) // 5 second timeout
        })

        const supabasePromise = supabase
          .from('learning_paths')
          .select('*')
          .order('rating', { ascending: false })

        const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any

        if (!error && data && data.length > 0) {
          // Only update if we get valid data from Supabase
          setLearningPaths(data)
        }
        // If there's an error or no data, keep the existing mock data
      } catch (error) {
        console.log('Using mock data due to connection issue:', error instanceof Error ? error.message : 'Unknown error')
        // Keep existing mock data, don't set it again
      }
    }

    // Add a small delay to prevent immediate API calls during development
    const timer = setTimeout(fetchLearningPaths, 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-gray-600">Loading learning paths...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Choose Your Learning Path</h2>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Structured learning journeys designed for different roles and career goals. 
            Start where you are, go where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {learningPaths.map((path, index) => (
            <LearningPathCard 
              key={path.id} 
              path={path} 
              progress={index === 1 ? 25 : undefined}
            />
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => {
              console.log('View all learning paths clicked')
            }}
            className="bg-gradient-to-r from-success/80 to-success text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-success hover:to-success/90 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 cursor-pointer"
          >
            View All Learning Paths
          </button>
        </div>
      </div>
    </section>
  )
}

// Mock data for fallback
const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Salesforce Administrator',
    description: 'Master the fundamentals of Salesforce administration, user management, and platform customization.',
    difficulty: 'Beginner',
    duration: '40-60 hours',
    modules_count: 12,
    key_skills: ['User Management', 'Data Management', 'Security'],
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Platform Developer',
    description: 'Learn Apex programming, Lightning Web Components, and advanced development techniques.',
    difficulty: 'Intermediate',
    duration: '80-120 hours',
    modules_count: 18,
    key_skills: ['Apex', 'Lightning Web Components', 'Visualforce'],
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Sales Cloud Consultant',
    description: 'Implement and configure Sales Cloud solutions for various business requirements.',
    difficulty: 'Intermediate',
    duration: '60-80 hours',
    modules_count: 15,
    key_skills: ['Sales Processes', 'Lead Management', 'Opportunity Management'],
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Technical Architect',
    description: 'Design scalable, secure, and high-performance Salesforce solutions.',
    difficulty: 'Advanced',
    duration: '120-160 hours',
    modules_count: 22,
    key_skills: ['Architecture Design', 'Integration', 'Security'],
    rating: 4.9,
  },
  {
    id: '5',
    title: 'Marketing Cloud Specialist',
    description: 'Create personalized customer journeys and marketing automation workflows.',
    difficulty: 'Intermediate',
    duration: '70-90 hours',
    modules_count: 16,
    key_skills: ['Email Marketing', 'Journey Builder', 'Automation'],
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Salesforce Associate',
    description: 'Start your Salesforce journey with foundational knowledge and core concepts.',
    difficulty: 'Beginner',
    duration: '20-30 hours',
    modules_count: 8,
    key_skills: ['CRM Basics', 'Navigation', 'Data Entry'],
    rating: 4.5,
  },
]

export default memo(LearningPathsSection)

