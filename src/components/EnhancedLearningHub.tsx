'use client'

import { useState } from 'react'
import SalesforceProductSelector from './SalesforceProductSelector'
import LearningPurposeSelector from './LearningPurposeSelector'
import { Sparkles, Loader2, ExternalLink, TrendingUp, Clock } from 'lucide-react'

interface EnhancedLearningHubProps {
  className?: string
}

export default function EnhancedLearningHub({ className = '' }: EnhancedLearningHubProps) {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [resources, setResources] = useState('')
  const [trendingInsights, setTrendingInsights] = useState('')
  const [cached, setCached] = useState(false)
  const [error, setError] = useState('')

  const handleFindResources = async () => {
    if (!selectedProduct || !selectedPurpose) {
      setError('Please select both a product/certification and learning goal')
      return
    }

    setIsGenerating(true)
    setError('')
    setResources('')
    setTrendingInsights('')

    try {
      const response = await fetch('/api/ai/resource-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_product: selectedProduct,
          selected_purpose: selectedPurpose,
          user_context: {
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResources(data.resources)
        setTrendingInsights(data.trending_insights)
        setCached(data.cached || false)
      } else {
        setError(data.error || 'Failed to find resources')
      }
    } catch (err) {
      console.error('Error finding resources:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatResourcesAsHTML = (resourcesText: string) => {
    return resourcesText
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold text-neutral-900 mb-3 flex items-center"><span class="mr-2">$1</span></h3>')
      .replace(/- \[(.*?)\]\((.*?)\)( \(.*?\))?$/gm, '<div class="mb-2"><a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary-600 hover:text-primary-700 hover:underline group transition-colors"><svg class="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>$1</a>$3</div>')
  }

  return (
    <div className={`bg-white rounded-xl shadow-soft border p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-neutral-900">AI-Powered Resource Finder</h2>
        </div>
        <p className="text-neutral-600 text-sm">
          Get personalized learning resources with live trending data and Agentforce prioritization
        </p>
      </div>

      <div className="space-y-6">
        {/* Product/Certification Selector */}
        <SalesforceProductSelector
          value={selectedProduct}
          onChange={setSelectedProduct}
          label="🔍 Select Salesforce Product/Certification"
          placeholder="Type to search 150+ products..."
        />

        {/* Purpose Selector */}
        <LearningPurposeSelector
          value={selectedPurpose}
          onChange={setSelectedPurpose}
          label="🎯 Your Learning Goal"
        />

        {/* Generate Button */}
        <button
          onClick={handleFindResources}
          disabled={!selectedProduct || !selectedPurpose || isGenerating}
          className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-6 rounded-xl hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-medium hover:shadow-large font-medium flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Finding Best Resources...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Find Learning Resources</span>
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {(resources || trendingInsights) && (
          <div className="space-y-6 border-t border-neutral-200 pt-6">
            {/* Cache Status */}
            {cached && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 text-sm">Results from cache (updated within 24 hours)</span>
              </div>
            )}

            {/* Trending Insights */}
            {trendingInsights && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Current Trends & Insights</h3>
                </div>
                <p className="text-purple-800 text-sm leading-relaxed">{trendingInsights}</p>
              </div>
            )}

            {/* Learning Resources */}
            {resources && (
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center">
                  <span className="mr-2">📚</span>
                  Curated Learning Resources
                </h3>
                <div 
                  className="prose prose-sm max-w-none prose-blue prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-h3:text-neutral-900 prose-h3:font-semibold prose-h3:text-lg prose-h3:mb-3"
                  dangerouslySetInnerHTML={{ __html: formatResourcesAsHTML(resources) }}
                />
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleFindResources()}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Refresh with Latest Trends</span>
              </button>
              
              {selectedPurpose === 'certification_prep' && (
                <button
                  onClick={() => {
                    // Navigate to flashcard generator with context
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 hover:bg-accent-50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <span>🎯</span>
                  <span>Generate Study Flashcards</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500 text-center">
          <span className="font-medium">AI-Enhanced:</span> Resources prioritized with live Salesforce trends • 
          Agentforce Specialist featured as top trending certification
        </p>
      </div>
    </div>
  )
}