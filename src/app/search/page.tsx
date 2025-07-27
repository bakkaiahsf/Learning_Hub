'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import LearningPathCard from '@/components/LearningPathCard'
import { LearningPath } from '@/lib/supabase'
import { Search, BookOpen, Filter } from 'lucide-react'

interface SearchResults {
  learning_paths: LearningPath[]
  modules: Array<{
    id: string
    title: string
    content: string
    learning_paths: { title: string }
  }>
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResults>({ learning_paths: [], modules: [] })
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [activeFilter, setActiveFilter] = useState<'all' | 'paths' | 'modules'>('all')

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        console.error('Search failed')
        setResults({ learning_paths: [], modules: [] })
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults({ learning_paths: [], modules: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchInput.trim())}`)
      performSearch(searchInput.trim())
    }
  }

  const filteredResults = () => {
    switch (activeFilter) {
      case 'paths':
        return { learning_paths: results.learning_paths, modules: [] }
      case 'modules':
        return { learning_paths: [], modules: results.modules }
      default:
        return results
    }
  }

  const filtered = filteredResults()
  const totalResults = results.learning_paths.length + results.modules.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 overflow-x-hidden">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Search className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-neutral-900">Search Results</h1>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleNewSearch} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for learning paths, modules, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-large font-medium whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {query && (
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${totalResults} results found for "${query}"`}
            </p>
          )}
        </div>

        {query && !loading && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Filter by:</span>
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: `All (${totalResults})` },
                    { key: 'paths', label: `Learning Paths (${results.learning_paths.length})` },
                    { key: 'modules', label: `Modules (${results.modules.length})` }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveFilter(key as typeof activeFilter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-8">
              {/* Learning Paths */}
              {filtered.learning_paths.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Paths</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.learning_paths.map((path) => (
                      <LearningPathCard key={path.id} path={path} />
                    ))}
                  </div>
                </section>
              )}

              {/* Modules */}
              {filtered.modules.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Modules</h2>
                  <div className="space-y-4">
                    {filtered.modules.map((module) => (
                      <div key={module.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <BookOpen className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{module.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>Part of: {module.learning_paths.title}</span>
                              </span>
                            </div>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            View Module
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* No Results */}
              {totalResults === 0 && !loading && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try searching with different keywords or browse our learning paths.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/learning-paths'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Learning Paths
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Search through our comprehensive library of Salesforce learning paths, modules, and resources. 
              Find exactly what you need to advance your skills.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Salesforce Admin',
                'Apex Programming',
                'Lightning Components',
                'Data Management',
                'Security',
                'Integration'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchInput(suggestion)
                    performSearch(suggestion)
                    window.history.pushState({}, '', `/search?q=${encodeURIComponent(suggestion)}`)
                  }}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>}>
      <SearchContent />
    </Suspense>
  )
}