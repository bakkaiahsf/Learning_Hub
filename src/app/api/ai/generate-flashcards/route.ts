import { NextRequest, NextResponse } from 'next/server'
import { generateFlashcards } from '@/lib/ai/deepseek'
import { fetchTrailheadContent, fetchDeveloperDocsContent, saveContentToDatabase } from '@/lib/ai/content-fetcher'
import { supabase } from '@/lib/supabase'

interface FlashcardRequest {
  content_url?: string
  text_content?: string
  topic: string
  num_flashcards?: number
  certification?: string
  difficulty_preference?: 'mixed' | 'easy' | 'medium' | 'hard'
  save_content?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: FlashcardRequest = await request.json()
    
    const { 
      content_url, 
      text_content, 
      topic, 
      num_flashcards = 10, 
      certification,
      difficulty_preference = 'mixed',
      save_content = true 
    } = body

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Topic is required for flashcard generation' 
      }, { status: 400 })
    }

    if (num_flashcards < 1 || num_flashcards > 50) {
      return NextResponse.json({ 
        error: 'Number of flashcards must be between 1 and 50' 
      }, { status: 400 })
    }

    let contentForFlashcards = text_content
    let sourceContentId: string | null = null
    let contentTitle = 'User Provided Content'

    // If URL provided, fetch content from the URL
    if (content_url) {
      console.log('Fetching content for flashcards from URL:', content_url)
      
      let fetchedContent = null
      
      if (content_url.includes('trailhead.salesforce.com')) {
        fetchedContent = await fetchTrailheadContent(content_url)
      } else if (content_url.includes('developer.salesforce.com')) {
        fetchedContent = await fetchDeveloperDocsContent(content_url)
      } else {
        // For other URLs, try a generic fetch
        try {
          const response = await fetch(content_url, {
            headers: {
              'User-Agent': 'SalesforceLearnHub-Bot/1.0',
            },
          })
          
          if (response.ok) {
            const html = await response.text()
            const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            fetchedContent = {
              url: content_url,
              title: topic,
              content: text,
              content_type: 'certification_guide' as const,
              metadata: { certification: certification }
            }
          }
        } catch (fetchError) {
          console.error('Error fetching from URL:', fetchError)
        }
      }

      if (fetchedContent) {
        contentForFlashcards = fetchedContent.content
        contentTitle = fetchedContent.title
        
        // Save fetched content to database if requested
        if (save_content) {
          sourceContentId = await saveContentToDatabase(fetchedContent)
        }
      } else if (!text_content) {
        return NextResponse.json({ 
          error: 'Failed to fetch content from URL and no text content provided' 
        }, { status: 400 })
      }
    }

    if (!contentForFlashcards || contentForFlashcards.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No content provided for flashcard generation' 
      }, { status: 400 })
    }

    // Limit content length to prevent excessive token usage
    const maxContentLength = 12000 // Roughly 3000 tokens
    if (contentForFlashcards.length > maxContentLength) {
      contentForFlashcards = contentForFlashcards.substring(0, maxContentLength) + '...'
    }

    console.log('Generating flashcards for topic:', topic)
    
    // Generate AI flashcards
    const { flashcards, tokens } = await generateFlashcards(
      contentForFlashcards, 
      topic, 
      num_flashcards,
      certification
    )

    // Filter flashcards by difficulty preference if specified
    let filteredFlashcards = flashcards
    if (difficulty_preference !== 'mixed') {
      const targetDifficulty = difficulty_preference.charAt(0).toUpperCase() + difficulty_preference.slice(1)
      filteredFlashcards = flashcards.filter(card => 
        card.difficulty.toLowerCase() === targetDifficulty.toLowerCase()
      )
      
      // If not enough cards of the preferred difficulty, include some mixed ones
      if (filteredFlashcards.length < Math.min(num_flashcards / 2, 5)) {
        const remainingCards = flashcards.filter(card => 
          card.difficulty.toLowerCase() !== targetDifficulty.toLowerCase()
        ).slice(0, num_flashcards - filteredFlashcards.length)
        filteredFlashcards = [...filteredFlashcards, ...remainingCards]
      }
    }

    // Save flashcard set to database
    let flashcardSetId: string | null = null
    try {
      const { data: savedFlashcards, error: saveError } = await supabase
        .from('ai_generated_flashcards')
        .insert({
          topic: topic,
          source_content_id: sourceContentId,
          flashcards_data: filteredFlashcards,
          certification_focus: certification,
          num_cards: filteredFlashcards.length,
          cost_in_tokens: tokens,
          ai_model_used: 'deepseek-reasoner'
        })
        .select('id')
        .single()

      if (saveError) {
        console.error('Error saving flashcards:', saveError)
      } else {
        flashcardSetId = savedFlashcards.id
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    // Track usage analytics
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'flashcards',
        ai_model_used: 'deepseek-reasoner',
        tokens_consumed: tokens,
        cost_estimate: (tokens / 1000000) * 0.55, // DeepSeek reasoner pricing
        success: true
      })
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
    }

    // Generate study recommendations
    const studyRecommendations = generateStudyRecommendations(
      filteredFlashcards, 
      certification, 
      difficulty_preference
    )

    return NextResponse.json({
      id: flashcardSetId,
      success: true,
      flashcard_set: {
        topic: topic,
        flashcards: filteredFlashcards,
        certification_focus: certification,
        content_source: contentTitle,
        content_url: content_url || null,
        study_recommendations: studyRecommendations
      },
      metadata: {
        generated_at: new Date().toISOString(),
        total_cards: filteredFlashcards.length,
        tokens_used: tokens,
        estimated_cost: (tokens / 1000000) * 0.55,
        model_used: 'deepseek-reasoner',
        content_length: contentForFlashcards.length,
        difficulty_breakdown: getDifficultyBreakdown(filteredFlashcards)
      }
    })

  } catch (error: any) {
    console.error('Flashcard generation error:', error)
    
    // Track failed attempts
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'flashcards',
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
      error: 'Failed to generate flashcards',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')
    const certification = searchParams.get('certification')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('ai_generated_flashcards')
      .select(`
        *,
        raw_content:source_content_id (
          title,
          source_url,
          content_type
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (topic) {
      query = query.ilike('topic', `%${topic}%`)
    }

    if (certification) {
      query = query.ilike('certification_focus', `%${certification}%`)
    }

    const { data: flashcardSets, error } = await query

    if (error) {
      console.error('Error fetching flashcard sets:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch flashcard sets' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      flashcard_sets: flashcardSets || [],
      count: flashcardSets?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching flashcard sets:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch flashcard sets',
      details: error.message 
    }, { status: 500 })
  }
}

// Helper functions

function generateStudyRecommendations(
  flashcards: any[], 
  certification?: string, 
  difficulty?: string
): string[] {
  const recommendations = [
    'Review each flashcard multiple times with spaced repetition',
    'Focus on understanding concepts, not just memorizing answers',
    'Practice explaining answers in your own words'
  ]

  if (certification) {
    recommendations.push(`Align your study with ${certification} certification exam objectives`)
    recommendations.push('Take practice exams after mastering these flashcards')
  }

  const hardCards = flashcards.filter(card => card.difficulty === 'Hard').length
  if (hardCards > 0) {
    recommendations.push('Spend extra time on the "Hard" difficulty cards')
    recommendations.push('Create additional examples for complex concepts')
  }

  if (flashcards.some(card => card.tags.includes('hands-on') || card.tags.includes('practical'))) {
    recommendations.push('Practice these concepts in a Salesforce org or trailhead playground')
  }

  return recommendations
}

function getDifficultyBreakdown(flashcards: any[]): Record<string, number> {
  const breakdown = { Easy: 0, Medium: 0, Hard: 0 }
  
  flashcards.forEach(card => {
    if (breakdown.hasOwnProperty(card.difficulty)) {
      breakdown[card.difficulty as keyof typeof breakdown]++
    }
  })
  
  return breakdown
}