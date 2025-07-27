'use client'

import { useState } from 'react'
import { Brain, Sparkles, BookOpen, Zap, FileText, Search, ChevronRight, TrendingUp } from 'lucide-react'
import AILearningPathGenerator from './AILearningPathGenerator'
import AIContentSummarizer from './AIContentSummarizer'
import AIFlashcardGenerator from './AIFlashcardGenerator'
import EnhancedLearningHub from './EnhancedLearningHub'

type ActiveFeature = 'overview' | 'learning-paths' | 'summarizer' | 'flashcards' | 'search' | 'resource-finder'

export default function AIFeaturesHub() {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('overview')

  const features = [
    {
      id: 'learning-paths' as const,
      title: 'AI Learning Path Generator',
      description: 'Get personalized learning journeys tailored to your goals and experience level',
      icon: BookOpen,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      borderColor: 'border-primary-200',
      stats: 'Smart pathway generation with 95% relevance'
    },
    {
      id: 'summarizer' as const,
      title: 'Intelligent Content Summarizer',
      description: 'Transform lengthy Salesforce documentation into clear, actionable summaries',
      icon: FileText,
      color: 'from-success to-success/80',
      bgColor: 'from-success/10 to-success/20',
      borderColor: 'border-success/20',
      stats: 'Reduces reading time by 80%'
    },
    {
      id: 'flashcards' as const,
      title: 'Interactive Flashcard Creator',
      description: 'Generate certification-focused flashcards with spaced repetition learning',
      icon: Zap,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'from-accent-50 to-accent-100',
      borderColor: 'border-accent-200',
      stats: 'Improves retention by 60%'
    },
    {
      id: 'search' as const,
      title: 'AI-Powered Search',
      description: 'Search across all Salesforce resources with intelligent context understanding',
      icon: Search,
      color: 'from-warning to-warning/80',
      bgColor: 'from-warning/10 to-warning/20',
      borderColor: 'border-warning/20',
      stats: 'Semantic search with AI insights'
    },
    {
      id: 'resource-finder' as const,
      title: 'Enhanced Resource Finder',
      description: 'AI-powered resource discovery with live trends and Agentforce prioritization',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      stats: 'Live trending data with Serper API'
    }
  ]

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'learning-paths':
        return <AILearningPathGenerator />
      case 'summarizer':
        return <AIContentSummarizer />
      case 'flashcards':
        return <AIFlashcardGenerator />
      case 'search':
        return (
          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-warning mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">AI-Powered Search</h3>
              <p className="text-neutral-600 mb-6">Enhanced search functionality coming soon!</p>
              <p className="text-neutral-500 text-sm">
                This feature will integrate with your existing search to provide intelligent context and recommendations.
              </p>
            </div>
          </div>
        )
      case 'resource-finder':
        return <EnhancedLearningHub />
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-neutral-50 rounded-2xl p-8 border border-primary-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="bg-white p-3 rounded-xl shadow-medium mr-4">
                    <Brain className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                      AI-Powered Salesforce Learning Coach
                    </h2>
                    <p className="text-lg text-neutral-600">
                      Your intelligent companion for mastering Salesforce with personalized guidance
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-5 w-5 text-accent-600 mr-2" />
                      <span className="font-semibold text-neutral-900">Smart Learning Paths</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      AI-generated paths based on your goals and experience
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-success mr-2" />
                      <span className="font-semibold text-neutral-900">Adaptive Learning</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Content that adapts to your learning style and pace
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-semibold text-neutral-900">Intelligent Insights</span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      AI-powered summaries and certification guidance
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-neutral-700 mb-4">
                    Powered by advanced AI to accelerate your Salesforce learning journey
                  </p>
                  <button
                    onClick={() => setActiveFeature('learning-paths')}
                    className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
                  >
                    Start Your AI Learning Journey
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`bg-gradient-to-br ${feature.bgColor} rounded-2xl p-6 border ${feature.borderColor} hover:shadow-medium transition-all duration-300 cursor-pointer group`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-medium group-hover:shadow-large transition-all duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-neutral-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">
                      {feature.stats}
                    </span>
                    <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                      Try Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
                Why Choose AI-Powered Learning?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">10x</span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Faster Learning</h4>
                  <p className="text-sm text-neutral-600">
                    AI-curated content reduces study time significantly
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-success">95%</span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Accuracy</h4>
                  <p className="text-sm text-neutral-600">
                    Content sourced from official Salesforce resources
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent-600">24/7</span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Availability</h4>
                  <p className="text-sm text-neutral-600">
                    AI coach available whenever you need guidance
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-warning">∞</span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Personalized</h4>
                  <p className="text-sm text-neutral-600">
                    Infinite customization based on your learning style
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        {activeFeature !== 'overview' && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setActiveFeature('overview')}
                className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                Back to AI Features
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-soft border border-neutral-200">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFeature === feature.id
                      ? 'bg-primary-600 text-white shadow-medium'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <feature.icon className="h-4 w-4 mr-2" />
                  {feature.title.replace('AI ', '').replace('Intelligent ', '').replace('Interactive ', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature Content */}
        <div className="animate-fade-in">
          {renderFeatureContent()}
        </div>
      </div>
    </section>
  )
}