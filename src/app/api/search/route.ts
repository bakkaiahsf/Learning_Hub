import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { query, enhance_with_ai = false, user_context } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // If AI enhancement is requested, delegate to the intelligent search API
    if (enhance_with_ai) {
      try {
        const aiSearchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/ai/intelligent-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: query.trim(),
            user_context,
            search_type: 'hybrid',
            enhance_with_ai: true
          }),
        })

        if (aiSearchResponse.ok) {
          const aiResults = await aiSearchResponse.json()
          return NextResponse.json({
            enhanced: true,
            ...aiResults.search_results
          })
        }
      } catch (aiError) {
        console.error('AI search enhancement failed:', aiError)
        // Fall back to regular search
      }
    }

    // Log the search query
    try {
      await supabase
        .from('search_queries')
        .upsert(
          { query_text: query.trim() },
          { onConflict: 'query_text' }
        )
    } catch (error) {
      console.log('Could not log search query:', error)
    }

    // Search in learning paths
    const { data: learningPaths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,key_skills.cs.{${query}}`)

    // Search in learning modules
    const { data: modules, error: modulesError } = await supabase
      .from('learning_modules')
      .select('*, learning_paths(title)')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

    // Search in AI-generated content
    const { data: aiLearningPaths } = await supabase
      .from('ai_generated_learning_paths')
      .select('*')
      .or(`request_prompt.ilike.%${query}%,generated_content->>title.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(5)

    const { data: aiSummaries } = await supabase
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

    const { data: flashcardSets } = await supabase
      .from('ai_generated_flashcards')
      .select('*')
      .ilike('topic', `%${query}%`)
      .limit(5)

    if (pathsError && modulesError) {
      // Fallback to mock search results
      return NextResponse.json({
        enhanced: false,
        learning_paths: mockSearchResults.learning_paths.filter(path => 
          path.title.toLowerCase().includes(query.toLowerCase()) ||
          path.description.toLowerCase().includes(query.toLowerCase()) ||
          path.key_skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
        ),
        modules: mockSearchResults.modules.filter(module =>
          module.title.toLowerCase().includes(query.toLowerCase()) ||
          module.content.toLowerCase().includes(query.toLowerCase())
        ),
        ai_learning_paths: [],
        ai_summaries: [],
        flashcard_sets: []
      })
    }

    return NextResponse.json({
      enhanced: false,
      learning_paths: learningPaths || [],
      modules: modules || [],
      ai_learning_paths: aiLearningPaths || [],
      ai_summaries: aiSummaries || [],
      flashcard_sets: flashcardSets || [],
      suggestions: generateSearchSuggestions(query, {
        learning_paths: learningPaths || [],
        ai_learning_paths: aiLearningPaths || [],
        flashcard_sets: flashcardSets || []
      })
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateSearchSuggestions(query: string, results: any): string[] {
  const suggestions = []
  
  // If query is certification-related, suggest flashcard generation
  if (query.toLowerCase().includes('certification') || query.toLowerCase().includes('exam')) {
    suggestions.push('Generate flashcards for certification preparation')
    suggestions.push('Create a personalized learning path for this certification')
  }
  
  // If query is about a specific topic, suggest content summarization
  if (results.learning_paths.length > 0) {
    suggestions.push('Get AI summaries of these learning paths')
    suggestions.push('Create flashcards from these topics')
  }
  
  // General AI-powered suggestions
  suggestions.push('Use AI to create a personalized learning plan')
  suggestions.push('Get intelligent summaries of Salesforce documentation')
  
  return suggestions.slice(0, 4)
}

export async function GET() {
  try {
    // Get popular search queries
    const { data, error } = await supabase
      .from('search_queries')
      .select('*')
      .order('count', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json(mockPopularSearches)
    }

    return NextResponse.json(data || mockPopularSearches)
  } catch (error) {
    console.error('Popular searches API error:', error)
    return NextResponse.json(mockPopularSearches)
  }
}

// Mock data for fallback
const mockSearchResults = {
  learning_paths: [
    {
      id: '1',
      title: 'Salesforce Administrator',
      description: 'Master the fundamentals of Salesforce administration, user management, and platform customization.',
      difficulty: 'Beginner',
      duration: '40-60 hours',
      modules_count: 12,
      key_skills: ['User Management', 'Data Management', 'Security'],
      rating: 4.8,
    }
  ],
  modules: [
    {
      id: '1',
      title: 'Introduction to Salesforce Administration',
      content: 'Learn the basics of Salesforce administration including user setup, profiles, and permissions.',
      learning_paths: { title: 'Salesforce Administrator' }
    }
  ]
}

const mockPopularSearches = [
  { id: '1', query_text: 'How to become a Salesforce admin?', count: 150 },
  { id: '2', query_text: 'Apex programming tutorial', count: 120 },
  { id: '3', query_text: 'Lightning Web Components guide', count: 100 },
  { id: '4', query_text: 'Admin certification prep', count: 90 },
  { id: '5', query_text: 'Flow Builder basics', count: 80 }
]

