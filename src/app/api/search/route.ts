import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
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

    if (pathsError && modulesError) {
      // Fallback to mock search results
      return NextResponse.json({
        learning_paths: mockSearchResults.learning_paths.filter(path => 
          path.title.toLowerCase().includes(query.toLowerCase()) ||
          path.description.toLowerCase().includes(query.toLowerCase()) ||
          path.key_skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
        ),
        modules: mockSearchResults.modules.filter(module =>
          module.title.toLowerCase().includes(query.toLowerCase()) ||
          module.content.toLowerCase().includes(query.toLowerCase())
        )
      })
    }

    return NextResponse.json({
      learning_paths: learningPaths || [],
      modules: modules || []
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
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

