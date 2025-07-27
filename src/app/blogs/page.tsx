'use client'

import Header from '@/components/Header'
import { Calendar, Clock, User, ExternalLink, TrendingUp, Tag } from 'lucide-react'

export default function BlogsPage() {
  const featuredBlogs = [
    {
      id: '1',
      title: 'Mastering Agentforce: The Future of AI-Powered Customer Service',
      excerpt: 'Dive deep into Salesforce\'s revolutionary Agentforce platform and learn how to implement autonomous AI agents that transform customer interactions.',
      author: 'Sarah Chen',
      publishDate: '2024-01-25',
      readTime: '8 min read',
      category: 'AI Innovation',
      trending: true,
      image: '/api/placeholder/600/300',
      url: 'https://www.salesforce.com/products/platform/features/ai/'
    },
    {
      id: '2',
      title: 'Einstein GPT Best Practices: From Setup to Advanced Implementation',
      excerpt: 'Complete guide to implementing Einstein GPT across Sales Cloud, Service Cloud, and Marketing Cloud with real-world examples and optimization tips.',
      author: 'Marcus Rodriguez',
      publishDate: '2024-01-22',
      readTime: '12 min read',
      category: 'Implementation',
      trending: true,
      image: '/api/placeholder/600/300',
      url: 'https://help.salesforce.com/s/articleView?id=sf.einstein_overview.htm'
    },
    {
      id: '3',
      title: 'Platform Developer Certification: Updated 2024 Study Guide',
      excerpt: 'Everything you need to know for the Platform Developer I certification, including the latest exam topics, hands-on exercises, and study resources.',
      author: 'Jennifer Kim',
      publishDate: '2024-01-20',
      readTime: '15 min read',
      category: 'Certification',
      trending: false,
      image: '/api/placeholder/600/300',
      url: 'https://trailhead.salesforce.com/en/credentials/platformdeveloperi'
    }
  ]

  const recentBlogs = [
    {
      id: '4',
      title: 'Lightning Web Components: Advanced Patterns and Performance Tips',
      excerpt: 'Learn advanced LWC patterns, performance optimization techniques, and best practices for building scalable components.',
      author: 'David Park',
      publishDate: '2024-01-18',
      readTime: '10 min read',
      category: 'Development',
      url: 'https://developer.salesforce.com/docs/component-library/documentation/en/lwc'
    },
    {
      id: '5',
      title: 'Flow Builder Mastery: Automating Complex Business Processes',
      excerpt: 'Step-by-step guide to creating sophisticated automation workflows using Salesforce Flow Builder.',
      author: 'Lisa Wang',
      publishDate: '2024-01-15',
      readTime: '7 min read',
      category: 'Automation',
      url: 'https://help.salesforce.com/s/articleView?id=sf.flow.htm'
    },
    {
      id: '6',
      title: 'Salesforce Security: Multi-Factor Authentication and Beyond',
      excerpt: 'Comprehensive security guide covering MFA, session settings, login policies, and advanced security features.',
      author: 'Alex Thompson',
      publishDate: '2024-01-12',
      readTime: '9 min read',
      category: 'Security',
      url: 'https://help.salesforce.com/s/articleView?id=sf.security_overview.htm'
    },
    {
      id: '7',
      title: 'Integration Patterns: MuleSoft and Salesforce Best Practices',
      excerpt: 'Explore common integration patterns and best practices for connecting Salesforce with external systems using MuleSoft.',
      author: 'Raj Patel',
      publishDate: '2024-01-10',
      readTime: '11 min read',
      category: 'Integration',
      url: 'https://www.mulesoft.com/integration-solutions/saas/salesforce'
    },
    {
      id: '8',
      title: 'Data Cloud: Unifying Customer Data Across Platforms',
      excerpt: 'Learn how to leverage Salesforce Data Cloud to create a unified view of your customers across all touchpoints.',
      author: 'Emily Foster',
      publishDate: '2024-01-08',
      readTime: '6 min read',
      category: 'Data Management',
      url: 'https://www.salesforce.com/products/platform/features/data-integration/'
    }
  ]

  const categories = [
    'All',
    'AI Innovation',
    'Certification',
    'Development',
    'Implementation',
    'Automation',
    'Security',
    'Integration',
    'Data Management'
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'AI Innovation': 'bg-purple-100 text-purple-800',
      'Certification': 'bg-blue-100 text-blue-800',
      'Development': 'bg-green-100 text-green-800',
      'Implementation': 'bg-orange-100 text-orange-800',
      'Automation': 'bg-yellow-100 text-yellow-800',
      'Security': 'bg-red-100 text-red-800',
      'Integration': 'bg-indigo-100 text-indigo-800',
      'Data Management': 'bg-teal-100 text-teal-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors['default']
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Salesforce Learning Blog</h1>
          <p className="text-xl text-neutral-600 mb-6">
            Stay updated with the latest insights, tutorials, and best practices from Salesforce experts
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blogs */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">Featured & Trending</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <article key={blog.id} className="group">
                <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden hover:shadow-large transition-all duration-300 transform hover:-translate-y-1">
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 relative">
                    {blog.trending && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {blog.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(blog.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {blog.readTime}
                      </span>
                    </div>
                    
                    <a
                      href={blog.url}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:underline"
                    >
                      Read More
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Recent Blogs */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Articles</h2>
          
          <div className="space-y-6">
            {recentBlogs.map((blog) => (
              <article key={blog.id} className="group">
                <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(blog.category)}`}>
                          <Tag className="h-3 w-3 mr-1" />
                          {blog.category}
                        </span>
                        <span className="text-sm text-neutral-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(blog.publishDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-neutral-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-neutral-600 mb-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {blog.author}
                        </span>
                        <a
                          href={blog.url}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium hover:underline"
                        >
                          Read Article
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-100 mb-6 text-lg">
              Get the latest Salesforce insights and tutorials delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-neutral-900 border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-medium hover:bg-primary-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}