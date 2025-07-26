'use client'

import { Search, Sparkles } from 'lucide-react'
import { memo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SubscriptionModal from './SubscriptionModal'

function HeroSection() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }, [searchQuery, router])

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }, [handleSearch])
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-blue-600 font-medium">AI-Powered Learning Platform</span>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Master Salesforce with{' '}
          <span className="text-blue-600">AI-Powered Learning</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your intelligent guide to Salesforce mastery - from beginner to expert. 
          Get personalized learning paths, smart content summaries, and certification guidance.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about Salesforce..."
              className="w-full pl-12 pr-20 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'How to become a Salesforce admin?',
              'Apex programming tutorial',
              'Lightning Web Components guide',
              'Admin certification prep',
              'Flow Builder basics'
            ].map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearch(search)}
                className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Free Access →
          </button>
          <button 
            onClick={() => router.push('/learning-paths')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Browse Learning Paths
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-600">Learning Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
      
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </section>
  )
}

export default memo(HeroSection)

