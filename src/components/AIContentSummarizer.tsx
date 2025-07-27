'use client'

import { useState } from 'react'
import { FileText, Loader2, Link2, Sparkles, BookOpen, Tag, ExternalLink } from 'lucide-react'

interface SummaryData {
  text: string
  key_concepts: string[]
  summary_type: 'short' | 'medium' | 'long'
  content_title: string
  content_url?: string
}

export default function AIContentSummarizer() {
  const [contentUrl, setContentUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [focus, setFocus] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSummary(null)
    setError(null)

    if (!contentUrl && !textContent) {
      setError('Please provide either a URL or text content to summarize')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content_url: contentUrl || undefined,
          text_content: textContent || undefined,
          summary_length: summaryLength,
          focus: focus || undefined,
          save_content: true
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate summary')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setContentUrl('')
    setTextContent('')
    setFocus('')
    setSummary(null)
    setError(null)
  }

  const suggestedUrls = [
    {
      title: 'Lightning Web Components Basics',
      url: 'https://trailhead.salesforce.com/content/learn/modules/lwc_get_started'
    },
    {
      title: 'Apex Fundamentals',
      url: 'https://trailhead.salesforce.com/content/learn/modules/apex_fundamentals'
    },
    {
      title: 'Admin Essentials',
      url: 'https://trailhead.salesforce.com/content/learn/modules/admin_essentials'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-success/10 to-success/20 p-3 rounded-xl mr-4">
          <FileText className="h-6 w-6 text-success" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-neutral-900">AI Content Summarizer</h3>
          <p className="text-neutral-600">Get intelligent summaries of Salesforce learning content</p>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-neutral-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputMode === 'url' 
                ? 'bg-white text-primary-700 shadow-soft' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <Link2 className="h-4 w-4 mr-2" />
            From URL
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputMode === 'text' 
                ? 'bg-white text-primary-700 shadow-soft' 
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Direct Text
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === 'url' ? (
          <div>
            <label htmlFor="content-url" className="block text-sm font-semibold text-neutral-700 mb-2">
              Content URL *
            </label>
            <input
              id="content-url"
              type="url"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-success focus:border-success focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              placeholder="https://trailhead.salesforce.com/content/learn/modules/..."
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              required={inputMode === 'url'}
            />
            <div className="mt-3">
              <p className="text-sm text-neutral-600 mb-2">Try these popular Salesforce resources:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedUrls.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setContentUrl(suggestion.url)}
                    className="text-xs bg-neutral-100 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-primary-200 transition-all duration-200"
                  >
                    {suggestion.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="text-content" className="block text-sm font-semibold text-neutral-700 mb-2">
              Text Content *
            </label>
            <textarea
              id="text-content"
              rows={8}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-success focus:border-success focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200 resize-none"
              placeholder="Paste your Salesforce documentation, article, or any learning content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required={inputMode === 'text'}
            />
            <div className="mt-2 text-sm text-neutral-500">
              {textContent.length}/15000 characters (recommended limit for best results)
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="summary-length" className="block text-sm font-semibold text-neutral-700 mb-2">
              Summary Length
            </label>
            <select
              id="summary-length"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-success focus:border-success focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value as 'short' | 'medium' | 'long')}
            >
              <option value="short">Short (2-3 sentences)</option>
              <option value="medium">Medium (1-2 paragraphs)</option>
              <option value="long">Long (3-4 paragraphs)</option>
            </select>
          </div>

          <div>
            <label htmlFor="focus" className="block text-sm font-semibold text-neutral-700 mb-2">
              Focus Area (Optional)
            </label>
            <input
              id="focus"
              type="text"
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-success focus:border-success focus:outline-none bg-neutral-50 hover:bg-white transition-all duration-200"
              placeholder="e.g., certification prep, best practices, implementation"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-success/80 to-success text-white py-4 rounded-xl font-semibold hover:from-success hover:to-success/90 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />} 
            {loading ? 'Generating Summary...' : 'Generate AI Summary'}
          </button>
          
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-4 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-200 font-medium"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error font-medium">Error: {error}</p>
        </div>
      )}

      {summary && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 border border-success/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-success mr-2" />
                <h4 className="text-xl font-bold text-neutral-900">AI Summary</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-neutral-600">Length:</span>
                <span className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-medium border border-success/20">
                  {summary.summary_type}
                </span>
              </div>
            </div>
            
            <h5 className="text-lg font-semibold text-neutral-900 mb-3">{summary.content_title}</h5>
            
            {summary.content_url && (
              <div className="mb-4">
                <a
                  href={summary.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Original Content
                </a>
              </div>
            )}
            
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{summary.text}</p>
            </div>
          </div>

          {summary.key_concepts && summary.key_concepts.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-primary-600 mr-2" />
                <h5 className="text-lg font-bold text-neutral-900">Key Concepts</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.key_concepts.map((concept, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center mb-3">
              <BookOpen className="h-5 w-5 text-neutral-600 mr-2" />
              <h5 className="text-lg font-bold text-neutral-900">Next Steps</h5>
            </div>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">•</span>
                Create flashcards from the key concepts for better retention
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">•</span>
                Practice the concepts in a Salesforce org or Trailhead Playground
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">•</span>
                Find related learning modules to deepen your understanding
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 font-bold mr-2">•</span>
                Join the Trailblazer Community to discuss these concepts
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}