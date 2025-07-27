'use client'

import { useState } from 'react'
import { BookOpen, Loader2, Sparkles, Clock, Trophy, ExternalLink, CheckCircle } from 'lucide-react'

interface LearningPathModule {
  title: string
  description: string
  trailhead_link?: string
  developer_docs_link?: string
  estimated_time: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  key_concepts: string[]
  prerequisites?: string[]
}

interface GeneratedLearningPath {
  title: string
  description: string
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_total_duration: string
  modules: LearningPathModule[]
  certification_alignment?: string[]
  next_steps?: string[]
}

export default function AILearningPathGenerator() {
  const [prompt, setPrompt] = useState('')
  const [existingKnowledge, setExistingKnowledge] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [timeCommitment, setTimeCommitment] = useState('')
  const [certificationGoal, setCertificationGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [learningPath, setLearningPath] = useState<GeneratedLearningPath | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLearningPath(null)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          existing_knowledge: existingKnowledge,
          preferred_learning_style: learningStyle,
          time_commitment: timeCommitment,
          certification_goal: certificationGoal
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate learning path')
      }

      const data = await response.json()
      setLearningPath(data.learning_path)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20'
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20'
      case 'Advanced': return 'bg-error/10 text-error border-error/20'
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-primary-100 to-accent-100 p-3 rounded-xl mr-4">
          <Sparkles className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-neutral-900">AI Learning Path Generator</h3>
          <p className="text-neutral-600">Get a personalized Salesforce learning journey powered by AI</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-semibold text-neutral-700 mb-2">
            What do you want to learn? *
          </label>
          <textarea
            id="prompt"
            rows={3}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 resize-none"
            placeholder="e.g., I want to become a certified Salesforce Administrator and learn automation best practices"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="knowledge" className="block text-sm font-semibold text-neutral-700 mb-2">
              Current Experience
            </label>
            <textarea
              id="knowledge"
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 resize-none"
              placeholder="e.g., 1 year experience with Sales Cloud, basic admin tasks"
              value={existingKnowledge}
              onChange={(e) => setExistingKnowledge(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="learning-style" className="block text-sm font-semibold text-neutral-700 mb-2">
              Learning Style
            </label>
            <select
              id="learning-style"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
            >
              <option value="">Select preference</option>
              <option value="visual">Visual (diagrams, videos)</option>
              <option value="hands-on">Hands-on (practice, labs)</option>
              <option value="reading">Reading (documentation, guides)</option>
              <option value="mixed">Mixed approach</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="time" className="block text-sm font-semibold text-neutral-700 mb-2">
              Time Commitment
            </label>
            <select
              id="time"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
            >
              <option value="">Select availability</option>
              <option value="1-2 hours/week">1-2 hours per week</option>
              <option value="3-5 hours/week">3-5 hours per week</option>
              <option value="6-10 hours/week">6-10 hours per week</option>
              <option value="10+ hours/week">10+ hours per week</option>
              <option value="intensive">Intensive (full-time)</option>
            </select>
          </div>

          <div>
            <label htmlFor="certification" className="block text-sm font-semibold text-neutral-700 mb-2">
              Certification Goal
            </label>
            <select
              id="certification"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={certificationGoal}
              onChange={(e) => setCertificationGoal(e.target.value)}
            >
              <option value="">Select certification</option>
              <option value="Administrator">Administrator</option>
              <option value="Platform Developer I">Platform Developer I</option>
              <option value="Platform Developer II">Platform Developer II</option>
              <option value="Sales Cloud Consultant">Sales Cloud Consultant</option>
              <option value="Service Cloud Consultant">Service Cloud Consultant</option>
              <option value="Marketing Cloud Administrator">Marketing Cloud Administrator</option>
              <option value="Technical Architect">Technical Architect</option>
              <option value="No specific certification">No specific certification</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />} 
          {loading ? 'Generating Your Learning Path...' : 'Generate AI Learning Path'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error font-medium">Error: {error}</p>
        </div>
      )}

      {learningPath && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-neutral-900 mb-2">{learningPath.title}</h4>
                <p className="text-neutral-700 leading-relaxed">{learningPath.description}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${getDifficultyColor(learningPath.difficulty_level)}`}>
                {learningPath.difficulty_level}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-neutral-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{learningPath.estimated_total_duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{learningPath.modules?.length || 0} modules</span>
              </div>
              {learningPath.certification_alignment && learningPath.certification_alignment.length > 0 && (
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>{learningPath.certification_alignment.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-xl font-bold text-neutral-900 mb-4">Learning Modules</h5>
            <div className="space-y-4">
              {learningPath.modules?.map((module, index) => (
                <div key={index} className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h6 className="text-lg font-semibold text-neutral-900">{module.title}</h6>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.estimated_time}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-4 leading-relaxed">{module.description}</p>
                  
                  {module.key_concepts && module.key_concepts.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-neutral-700 mb-2 block">Key Concepts:</span>
                      <div className="flex flex-wrap gap-2">
                        {module.key_concepts.map((concept, idx) => (
                          <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-medium border border-primary-200">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-neutral-700 mb-2 block">Prerequisites:</span>
                      <div className="space-y-1">
                        {module.prerequisites.map((prereq, idx) => (
                          <div key={idx} className="flex items-center text-sm text-neutral-600">
                            <CheckCircle className="h-3 w-3 mr-2 text-success" />
                            {prereq}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    {module.trailhead_link && (
                      <a
                        href={module.trailhead_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Trailhead Module
                      </a>
                    )}
                    {module.developer_docs_link && (
                      <a
                        href={module.developer_docs_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Developer Docs
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {learningPath.next_steps && learningPath.next_steps.length > 0 && (
            <div className="bg-accent-50 rounded-xl p-6 border border-accent-200">
              <h5 className="text-lg font-bold text-neutral-900 mb-3">Next Steps</h5>
              <ul className="space-y-2">
                {learningPath.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start text-neutral-700">
                    <CheckCircle className="h-5 w-5 mr-3 text-accent-600 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}