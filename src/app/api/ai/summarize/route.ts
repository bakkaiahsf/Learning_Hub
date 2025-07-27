import { NextRequest, NextResponse } from 'next/server'
import { summarizeContent } from '@/lib/ai/deepseek'
import { fetchTrailheadContent, fetchDeveloperDocsContent, saveContentToDatabase } from '@/lib/ai/content-fetcher'
import { supabase } from '@/lib/supabase'

interface SummarizeRequest {
  content_url?: string
  text_content?: string
  summary_length?: 'short' | 'medium' | 'long'
  focus?: string
  save_content?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: SummarizeRequest = await request.json()
    
    const { 
      content_url, 
      text_content, 
      summary_length = 'medium', 
      focus,
      save_content = true 
    } = body

    let contentToSummarize = text_content
    let originalContentId: string | null = null
    let contentTitle = 'User Provided Content'

    // If URL provided, fetch content from the URL
    if (content_url) {
      console.log('Fetching content from URL:', content_url)
      
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
            // Simple text extraction (in production, use a proper HTML parser)
            const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            fetchedContent = {
              url: content_url,
              title: 'Web Content',
              content: text,
              content_type: 'developer_blog' as const,
              metadata: {}
            }
          }
        } catch (fetchError) {
          console.error('Error fetching from URL:', fetchError)
        }
      }

      if (fetchedContent) {
        contentToSummarize = fetchedContent.content
        contentTitle = fetchedContent.title
        
        // Save fetched content to database if requested
        if (save_content) {
          originalContentId = await saveContentToDatabase(fetchedContent)
        }
      } else if (!text_content) {
        return NextResponse.json({ 
          error: 'Failed to fetch content from URL and no text content provided' 
        }, { status: 400 })
      }
    }

    if (!contentToSummarize || contentToSummarize.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No content provided for summarization' 
      }, { status: 400 })
    }

    // Limit content length to prevent excessive token usage
    const maxContentLength = 15000 // Roughly 3000-4000 tokens
    if (contentToSummarize.length > maxContentLength) {
      contentToSummarize = contentToSummarize.substring(0, maxContentLength) + '...'
    }

    console.log('Generating summary for content:', contentTitle)
    
    // Generate AI summary
    const { summary, key_concepts, tokens } = await summarizeContent(
      contentToSummarize, 
      summary_length, 
      focus
    )

    // Save summary to database
    let summaryId: string | null = null
    try {
      const { data: savedSummary, error: saveError } = await supabase
        .from('ai_generated_summaries')
        .insert({
          original_content_id: originalContentId,
          summary_text: summary,
          summary_type: summary_length,
          key_concepts: key_concepts,
          cost_in_tokens: tokens,
          ai_model_used: 'deepseek-chat'
        })
        .select('id')
        .single()

      if (saveError) {
        console.error('Error saving summary:', saveError)
      } else {
        summaryId = savedSummary.id
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    // Track usage analytics
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'summary',
        ai_model_used: 'deepseek-chat',
        tokens_consumed: tokens,
        cost_estimate: (tokens / 1000000) * 0.27, // DeepSeek chat pricing
        success: true
      })
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
    }

    return NextResponse.json({
      id: summaryId,
      success: true,
      summary: {
        text: summary,
        key_concepts: key_concepts,
        summary_type: summary_length,
        content_title: contentTitle,
        content_url: content_url || null
      },
      metadata: {
        generated_at: new Date().toISOString(),
        tokens_used: tokens,
        estimated_cost: (tokens / 1000000) * 0.27,
        model_used: 'deepseek-chat',
        content_length: contentToSummarize.length
      }
    })

  } catch (error: any) {
    console.error('Summarization error:', error)
    
    // Track failed attempts
    try {
      await supabase.from('ai_usage_analytics').insert({
        operation_type: 'summary',
        ai_model_used: 'deepseek-chat',
        tokens_consumed: 0,
        cost_estimate: 0,
        success: false,
        error_message: error.message
      })
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError)
    }

    return NextResponse.json({ 
      error: 'Failed to generate summary',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('content_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('ai_generated_summaries')
      .select(`
        *,
        raw_content:original_content_id (
          title,
          source_url,
          content_type
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (contentId) {
      query = query.eq('original_content_id', contentId)
    }

    const { data: summaries, error } = await query

    if (error) {
      console.error('Error fetching summaries:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch summaries' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      summaries: summaries || [],
      count: summaries?.length || 0
    })

  } catch (error: any) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch summaries',
      details: error.message 
    }, { status: 500 })
  }
}