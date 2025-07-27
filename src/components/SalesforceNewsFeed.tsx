'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ExternalLink, Clock, Tag } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  summary: string
  ai_summary?: string
  url: string
  published_date: string
  category: string
  created_at: string
}

interface SalesforceNewsFeedProps {
  className?: string
}

export default function SalesforceNewsFeed({ className = '' }: SalesforceNewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setIsRefreshing(true)
      
      const response = forceRefresh 
        ? await fetch('/api/salesforce-news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forceRefresh: true })
          })
        : await fetch('/api/salesforce-news')
      
      const data = await response.json()
      
      if (data.success) {
        setNews(data.news)
        setLastUpdated(data.lastUpdated)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Product Launch': 'bg-blue-100 text-blue-800',
      'Financial': 'bg-green-100 text-green-800',
      'AI Innovation': 'bg-purple-100 text-purple-800',
      'Sustainability': 'bg-emerald-100 text-emerald-800',
      'Events': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors['default']
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-soft border p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Salesforce News</h2>
          <div className="animate-spin">
            <RefreshCw className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-soft border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Salesforce Ecosystem News</h2>
          {lastUpdated && (
            <p className="text-sm text-neutral-600 flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {formatDate(lastUpdated)}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchNews(true)}
          disabled={isRefreshing}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="space-y-5">
        {news.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p>No recent news available</p>
          </div>
        ) : (
          news.map((item) => (
            <article key={item.id} className="group">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-medium transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors leading-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-neutral-600 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(item.published_date)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded-lg transition-all duration-200 ml-3"
                    aria-label="Read full article"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {item.ai_summary || item.summary}
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-500 text-center">
          News automatically refreshed weekly • Source: salesforce.com/news
        </p>
      </div>
    </div>
  )
}