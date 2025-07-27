import { NextRequest, NextResponse } from 'next/server'
import { generateLearningPath } from '@/lib/ai/deepseek'
import { supabase } from '@/lib/supabase'

interface LearningPathRequest {
  user_id?: string
  prompt: string
  existing_knowledge?: string
  preferred_learning_style?: string
  time_commitment?: string
  certification_goal?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LearningPathRequest = await request.json()
    
    const { 
      user_id, 
      prompt, 
      existing_knowledge = '', 
      preferred_learning_style,
      time_commitment 
    } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Learning goal prompt is required' 
      }, { status: 400 })
    }

    // Enhance the prompt with additional context
    const enhancedPrompt = `
      ${prompt}
      
      Additional Context:
      - Current Knowledge: ${existing_knowledge}
      - Learning Style: ${preferred_learning_style || 'Mixed (visual, hands-on, reading)'}
      - Time Commitment: ${time_commitment || 'Flexible schedule'}
      
      Please create a comprehensive learning path that integrates:
      1. Official Salesforce Trailhead modules
      2. Developer documentation and guides
      3. Hands-on practice recommendations
      4. Real-world project ideas
      5. Certification preparation alignment
    `

    console.log('Generating learning path for:', prompt)
    
    // Generate the AI-powered learning path
    const { path, tokens } = await generateLearningPath(
      enhancedPrompt, 
      existing_knowledge,
      preferred_learning_style,
      time_commitment
    )

    // Save to database for analytics and future reference
    let savedPathId: string | null = null
    try {
      const { data: savedPath, error: saveError } = await supabase
        .from('ai_generated_learning_paths')
        .insert({
          user_id: user_id || null,
          request_prompt: prompt,
          existing_knowledge: existing_knowledge,
          generated_content: path,
          difficulty_level: path.difficulty_level,
          estimated_duration: path.estimated_total_duration,
          cost_in_tokens: tokens,
          ai_model_used: 'deepseek-reasoner',
          status: 'active'
        })
        .select('id')
        .single()

      if (saveError) {
        console.error('Error saving learning path:', saveError)
      } else {
        savedPathId = savedPath.id
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    // Track usage analytics
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'learning_path',
        ai_model_used: 'deepseek-reasoner',
        tokens_consumed: tokens,
        cost_estimate: (tokens / 1000000) * 0.55, // DeepSeek reasoner pricing
        success: true,
        user_id: user_id || null
      })
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
    }

    // Return the generated learning path with metadata
    return NextResponse.json({
      id: savedPathId,
      success: true,
      learning_path: path,
      metadata: {
        generated_at: new Date().toISOString(),
        tokens_used: tokens,
        estimated_cost: (tokens / 1000000) * 0.55,
        model_used: 'deepseek-reasoner'
      }
    })

  } catch (error: any) {
    console.error('Learning path generation error:', error)
    
    // Track failed attempts
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'learning_path',
        ai_model_used: 'deepseek-reasoner',
        tokens_consumed: 0,
        cost_estimate: 0,
        success: false,
        error_message: error.message
      })
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
    }

    return NextResponse.json({ 
      error: 'Failed to generate learning path',
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
      .from('ai_generated_learning_paths')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: learningPaths, error } = await query

    if (error) {
      console.error('Error fetching learning paths:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch learning paths' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      learning_paths: learningPaths || [],
      count: learningPaths?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch learning paths',
      details: error.message 
    }, { status: 500 })
  }
}