'use client'

import Header from '@/components/Header'
import { BookOpen, Download, Clock, Star, Filter, Search } from 'lucide-react'
import { useState } from 'react'

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const libraryItems = [
    {
      id: '1',
      title: 'Salesforce Admin Quick Reference Guide',
      type: 'guide',
      description: 'Essential reference for common admin tasks and troubleshooting',
      downloadUrl: '#',
      size: '2.4 MB',
      lastUpdated: '2 days ago',
      rating: 4.8,
      downloads: 1240
    },
    {
      id: '2',
      title: 'Apex Programming Best Practices',
      type: 'document',
      description: 'Comprehensive guide to writing efficient and maintainable Apex code',
      downloadUrl: '#',
      size: '3.7 MB',
      lastUpdated: '1 week ago',
      rating: 4.9,
      downloads: 892
    },
    {
      id: '3',
      title: 'Lightning Component Development Toolkit',
      type: 'toolkit',
      description: 'Templates, examples, and utilities for Lightning development',
      downloadUrl: '#',
      size: '15.2 MB',
      lastUpdated: '3 days ago',
      rating: 4.7,
      downloads: 634
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Resource Library</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our curated collection of guides, templates, tools, and reference materials to support your Salesforce journey.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="guide">Guides</option>
                  <option value="document">Documents</option>
                  <option value="toolkit">Toolkits</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {libraryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm text-blue-600 capitalize">{item.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Size: {item.size}</span>
                  <span>Updated: {item.lastUpdated}</span>
                  <span>{item.downloads} downloads</span>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
}