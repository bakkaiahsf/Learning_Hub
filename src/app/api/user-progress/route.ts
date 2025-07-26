import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        learning_modules (
          id,
          title,
          path_id,
          learning_paths (
            id,
            title
          )
        )
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('User progress fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('User progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, module_id, completed } = body

    if (!user_id || !module_id) {
      return NextResponse.json({ error: 'User ID and Module ID are required' }, { status: 400 })
    }

    // Upsert user progress
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id,
          module_id,
          completed: completed || false,
          last_accessed: new Date().toISOString()
        },
        { onConflict: 'user_id,module_id' }
      )
      .select()

    if (error) {
      console.error('User progress update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0] || {}, { status: 201 })
  } catch (error) {
    console.error('User progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, completed } = body

    if (!id) {
      return NextResponse.json({ error: 'Progress ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update({
        completed,
        last_accessed: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('User progress update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0] || {})
  } catch (error) {
    console.error('User progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

