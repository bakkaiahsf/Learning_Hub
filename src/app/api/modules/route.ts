import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathId = searchParams.get('path_id')

    let query = supabase
      .from('learning_modules')
      .select(`
        *,
        learning_paths (
          id,
          title
        )
      `)
      .order('order', { ascending: true })

    if (pathId) {
      query = query.eq('path_id', pathId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Modules fetch error:', error)
      // Return mock data if Supabase is not configured
      return NextResponse.json(pathId ? mockModules.filter(m => m.path_id === pathId) : mockModules)
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Modules API error:', error)
    return NextResponse.json(mockModules)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('learning_modules')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Module creation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mock data for fallback
const mockModules = [
  {
    id: '1',
    path_id: '1',
    title: 'Introduction to Salesforce Administration',
    content: 'Learn the basics of Salesforce administration including user setup, profiles, and permissions.',
    order: 1,
    learning_paths: { id: '1', title: 'Salesforce Administrator' }
  },
  {
    id: '2',
    path_id: '1',
    title: 'User Management and Security',
    content: 'Deep dive into user management, roles, profiles, and security settings in Salesforce.',
    order: 2,
    learning_paths: { id: '1', title: 'Salesforce Administrator' }
  },
  {
    id: '3',
    path_id: '2',
    title: 'Apex Programming Fundamentals',
    content: 'Introduction to Apex programming language, syntax, and basic concepts.',
    order: 1,
    learning_paths: { id: '2', title: 'Platform Developer' }
  },
  {
    id: '4',
    path_id: '2',
    title: 'Lightning Web Components Basics',
    content: 'Learn how to build Lightning Web Components for modern Salesforce applications.',
    order: 2,
    learning_paths: { id: '2', title: 'Platform Developer' }
  }
]

