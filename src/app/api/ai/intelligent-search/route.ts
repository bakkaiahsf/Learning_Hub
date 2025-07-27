import { NextRequest, NextResponse } from 'next/server'
import { enhanceSearchResults } from '@/lib/ai/deepseek'
import { searchStoredContent } from '@/lib/ai/content-fetcher'
import { supabase } from '@/lib/supabase'

interface IntelligentSearchRequest {
  query: string
  user_context?: string
  search_type?: 'keyword' | 'semantic' | 'hybrid'
  content_types?: string[]
  limit?: number
  enhance_with_ai?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: IntelligentSearchRequest = await request.json()
    
    const { 
      query, 
      user_context, 
      search_type = 'hybrid',
      content_types = [],
      limit = 10,
      enhance_with_ai = true
    } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Search query is required' 
      }, { status: 400 })
    }

    console.log('Intelligent search for:', query)

    // Perform multi-source search
    const searchResults = await performIntelligentSearch(
      query, 
      search_type, 
      content_types, 
      limit
    )

    let enhancedResponse = ''
    let recommendations: string[] = []
    let totalTokens = 0

    // Enhance results with AI if requested
    if (enhance_with_ai && searchResults.length > 0) {
      try {
        const enhancement = await enhanceSearchResults(
          query, 
          searchResults, 
          user_context
        )
        
        enhancedResponse = enhancement.enhanced_response
        recommendations = enhancement.recommendations
        totalTokens = enhancement.tokens
      } catch (enhanceError) {
        console.error('Enhancement error:', enhanceError)
        enhancedResponse = 'Search completed, but AI enhancement unavailable.'
      }
    }

    // Save search query and results
    let searchId: string | null = null
    try {
      const { data: savedSearch, error: saveError } = await supabase
        .from('ai_search_queries')
        .insert({
          query_text: query,
          search_type: search_type,
          results_found: searchResults.length,
          top_results: searchResults.slice(0, 5).map(r => ({
            id: r.id,
            title: r.title,
            relevance_score: r.relevance_score || 0.5
          })),
          ai_enhanced_response: enhancedResponse,
          cost_in_tokens: totalTokens
        })
        .select('id')
        .single()

      if (saveError) {
        console.error('Error saving search:', saveError)
      } else {
        searchId = savedSearch.id
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    // Track usage analytics
    if (enhance_with_ai && totalTokens > 0) {
      try {
        await supabase.from('ai_usage_analytics').insert({
          operation_type: 'search',
          ai_model_used: 'deepseek-chat',
          tokens_consumed: totalTokens,
          cost_estimate: (totalTokens / 1000000) * 0.27,
          success: true
        })
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError)
      }
    }

    // Generate related topics and learning suggestions
    const relatedTopics = generateRelatedTopics(query, searchResults)
    const learningSuggestions = generateLearningSuggestions(query, searchResults)

    return NextResponse.json({
      id: searchId,
      success: true,
      search_results: {
        query: query,
        total_results: searchResults.length,
        results: searchResults,
        ai_enhanced_response: enhancedResponse,
        recommendations: recommendations,
        related_topics: relatedTopics,
        learning_suggestions: learningSuggestions
      },
      metadata: {
        searched_at: new Date().toISOString(),
        search_type: search_type,
        tokens_used: totalTokens,
        estimated_cost: enhance_with_ai ? (totalTokens / 1000000) * 0.27 : 0,
        content_sources: [...new Set(searchResults.map(r => r.content_type))]
      }
    })

  } catch (error: any) {
    console.error('Intelligent search error:', error)

    return NextResponse.json({ 
      error: 'Search failed',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('ai_search_queries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: searchHistory, error } = await query

    if (error) {
      console.error('Error fetching search history:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch search history' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      search_history: searchHistory || [],
      count: searchHistory?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching search history:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch search history',
      details: error.message 
    }, { status: 500 })
  }
}

// Helper functions

async function performIntelligentSearch(
  query: string, 
  searchType: string, 
  contentTypes: string[], 
  limit: number
): Promise<any[]> {
  const results: any[] = []

  try {
    // Search stored content
    const storedContent = await searchStoredContent(query, undefined, limit)
    results.push(...storedContent.map(content => ({
      ...content,
      source: 'stored_content',
      relevance_score: calculateRelevanceScore(query, content.title + ' ' + content.raw_text)
    })))

    // Search learning paths
    const { data: learningPaths } = await supabase
      .from('ai_generated_learning_paths')
      .select('*')
      .or(`request_prompt.ilike.%${query}%,generated_content->>title.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(5)

    if (learningPaths) {
      results.push(...learningPaths.map(path => ({
        ...path,
        source: 'learning_paths',
        content_type: 'learning_path',
        title: path.generated_content?.title || 'Learning Path',
        description: path.generated_content?.description || path.request_prompt,
        relevance_score: calculateRelevanceScore(query, path.request_prompt)
      })))
    }

    // Search flashcard sets
    const { data: flashcardSets } = await supabase
      .from('ai_generated_flashcards')
      .select('*')
      .ilike('topic', `%${query}%`)
      .limit(5)

    if (flashcardSets) {
      results.push(...flashcardSets.map(set => ({
        ...set,
        source: 'flashcard_sets',
        content_type: 'flashcard_set',
        title: `${set.topic} Flashcards`,
        description: `${set.num_cards} flashcards for ${set.topic}`,
        relevance_score: calculateRelevanceScore(query, set.topic)
      })))
    }

    // Search summaries
    const { data: summaries } = await supabase
      .from('ai_generated_summaries')
      .select(`
        *,
        raw_content:original_content_id (
          title,
          source_url,
          content_type
        )
      `)
      .ilike('summary_text', `%${query}%`)
      .limit(5)

    if (summaries) {
      results.push(...summaries.map(summary => ({
        ...summary,
        source: 'summaries',
        content_type: 'summary',
        title: summary.raw_content?.title || 'Content Summary',
        description: summary.summary_text.substring(0, 200) + '...',
        relevance_score: calculateRelevanceScore(query, summary.summary_text)
      })))
    }

  } catch (error) {
    console.error('Search error:', error)
  }

  // Sort by relevance and apply limit
  return results
    .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
    .slice(0, limit)
}

function calculateRelevanceScore(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const textLower = text.toLowerCase()
  
  let score = 0
  let totalWords = queryWords.length
  
  queryWords.forEach(word => {
    if (textLower.includes(word)) {
      score += 1
      // Bonus for exact matches at word boundaries
      const wordRegex = new RegExp(`\\b${word}\\b`, 'i')
      if (wordRegex.test(textLower)) {
        score += 0.5
      }
    }
  })
  
  return totalWords > 0 ? score / totalWords : 0
}

function generateRelatedTopics(query: string, searchResults: any[]): string[] {
  const topics = new Set<string>()
  
  // Extract topics from search results
  searchResults.forEach(result => {
    if (result.content_type === 'trailhead_module') {
      if (result.metadata?.badges) {
        result.metadata.badges.forEach((badge: string) => topics.add(badge))
      }
    }
    
    if (result.content_type === 'flashcard_set') {
      topics.add(result.topic)
    }
    
    if (result.metadata?.category) {
      topics.add(result.metadata.category)
    }
  })
  
  // Add some Salesforce-specific related topics based on query
  const queryLower = query.toLowerCase()
  if (queryLower.includes('admin')) {
    topics.add('User Management')
    topics.add('Security')
    topics.add('Reports and Dashboards')
  }
  
  if (queryLower.includes('developer') || queryLower.includes('apex')) {
    topics.add('Lightning Web Components')
    topics.add('Visualforce')
    topics.add('Integration')
  }
  
  if (queryLower.includes('sales')) {
    topics.add('Opportunities')
    topics.add('Leads')
    topics.add('Campaigns')
  }

  return Array.from(topics).slice(0, 8)
}

function generateLearningSuggestions(query: string, searchResults: any[]): string[] {
  const suggestions = []
  
  if (searchResults.length > 0) {
    suggestions.push('Create a personalized learning path based on these results')
    suggestions.push('Generate flashcards from the most relevant content')
    suggestions.push('Get AI-powered summaries of key resources')
  }
  
  const queryLower = query.toLowerCase()
  
  if (queryLower.includes('certification') || queryLower.includes('exam')) {
    suggestions.push('Focus on hands-on practice with Trailhead Playgrounds')
    suggestions.push('Take practice exams to assess your readiness')
  }
  
  if (queryLower.includes('beginner') || queryLower.includes('basic')) {
    suggestions.push('Start with Trailhead fundamentals modules')
    suggestions.push('Join the Trailblazer Community for support')
  }
  
  suggestions.push('Bookmark important resources for future reference')
  suggestions.push('Set up a study schedule with spaced repetition')
  
  return suggestions.slice(0, 6)
}