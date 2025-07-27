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
    <section className="bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <div className="bg-white rounded-full p-3 shadow-soft border border-neutral-200 mr-3">
            <Sparkles className="h-6 w-6 text-accent-600" />
          </div>
          <span className="text-primary-700 font-semibold text-lg">AI-Powered Learning Platform</span>
        </div>
        
        <h1 className="text-6xl font-bold text-neutral-900 mb-8 leading-tight animate-slide-up">
          Master Salesforce with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">AI-Powered Learning</span>
        </h1>
        
        <p className="text-xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
          Your intelligent guide to Salesforce mastery - from beginner to expert. 
          Get personalized learning paths, smart content summaries, and certification guidance.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12 animate-scale-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about Salesforce..."
              className="w-full pl-14 pr-24 py-5 text-lg border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none shadow-large bg-white hover:shadow-xl transition-all duration-300"
            />
            <Search className="absolute left-5 top-5 h-6 w-6 text-neutral-400" />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-medium hover:shadow-large font-medium transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="mb-12 animate-fade-in">
          <p className="text-neutral-600 mb-6 text-lg">Popular searches:</p>
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
                className="bg-white text-neutral-700 px-6 py-3 rounded-full border border-neutral-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 cursor-pointer shadow-soft hover:shadow-medium font-medium"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up">
          <button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-large hover:shadow-xl transform hover:scale-105"
          >
            Get Free Access →
          </button>
          <button 
            onClick={() => router.push('/learning-paths')}
            className="bg-white text-primary-700 px-10 py-4 rounded-xl text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-all duration-200 cursor-pointer shadow-medium hover:shadow-large transform hover:scale-105"
          >
            Browse Learning Paths
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in">
          <div className="text-center bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-200">
            <div className="text-4xl font-bold text-neutral-900 mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">10,000+</div>
            <div className="text-neutral-600 font-medium">Learning Resources</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-200">
            <div className="text-4xl font-bold text-neutral-900 mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">50,000+</div>
            <div className="text-neutral-600 font-medium">Active Learners</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-8 shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-200">
            <div className="text-4xl font-bold text-neutral-900 mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">95%</div>
            <div className="text-neutral-600 font-medium">Success Rate</div>
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

