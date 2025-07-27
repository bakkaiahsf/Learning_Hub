'use client'

import { Search, Mail, MessageCircle, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { memo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SubscriptionModal from './SubscriptionModal'
import ContactModal from './ContactModal'

function Header() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }, [searchQuery, router])

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }, [handleSearch])
  return (
    <header className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 text-white p-2.5 rounded-xl shadow-medium group-hover:shadow-large transition-all duration-300">
                <span className="font-bold text-lg">SLH</span>
              </div>
              <span className="text-xl font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">SalesforceLearnHub</span>
            </Link>
          </div>

          {/* Enhanced Navigation - 9 Main Tabs */}
          <nav className="hidden xl:flex space-x-1 overflow-x-auto max-w-full">
            <Link href="/dashboard" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/learning-paths" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Learning Paths
            </Link>
            <Link href="/search" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Search
            </Link>
            <Link href="/library" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Library
            </Link>
            <Link href="/certifications" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Certifications
            </Link>
            <Link href="/community" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Community
            </Link>
            <Link href="/blogs" className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap">
              Blogs
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex items-center text-neutral-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded-lg transition-all duration-200"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Search and Auth */}
          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Ask anything about Salesforce..."
                className="w-48 lg:w-64 xl:w-72 pl-11 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 text-sm shadow-soft"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-3.5 text-neutral-400 hover:text-primary-600 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Contact</span>
              </button>
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2.5 rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-medium hover:shadow-large font-medium transform hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-neutral-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/learning-paths" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Learning Paths
              </Link>
              <Link 
                href="/search" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link 
                href="/library" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Library
              </Link>
              <Link 
                href="/certifications" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Certifications
              </Link>
              <Link 
                href="/community" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                href="/blogs" 
                className="text-neutral-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blogs
              </Link>
            </nav>
          </div>
        )}
      </div>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </header>
  )
}

export default memo(Header)

