import { NextRequest, NextResponse } from 'next/server'
import { findLearningResources } from '@/lib/ai/deepseek'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { selected_product, selected_purpose, user_context } = await request.json()

    if (!selected_product || !selected_purpose) {
      return NextResponse.json({ 
        error: 'Both selected_product and selected_purpose are required' 
      }, { status: 400 })
    }

    // Check if we have a recent cached result
    const cacheKey = `${selected_product}_${selected_purpose}`.toLowerCase().replace(/\s+/g, '_')
    const { data: cachedResult } = await supabase
      .from('ai_content_recommendations')
      .select('*')
      .eq('query_hash', cacheKey)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (cachedResult && !user_context?.force_refresh) {
      return NextResponse.json({
        success: true,
        resources: cachedResult.recommended_content,
        trending_insights: cachedResult.ai_insights,
        cached: true,
        cache_timestamp: cachedResult.created_at
      })
    }

    // Generate fresh resources using AI
    const result = await findLearningResources(selected_product, selected_purpose)

    // Store the result for caching
    try {
      await supabase
        .from('ai_content_recommendations')
        .insert({
          query_hash: cacheKey,
          user_query: `${selected_product} for ${selected_purpose}`,
          recommended_content: result.resources,
          ai_insights: result.trending_insights,
          recommendation_type: 'resource_finder',
          metadata: {
            selected_product,
            selected_purpose,
            tokens_used: result.tokens,
            user_context
          }
        })
    } catch (cacheError) {
      console.error('Failed to cache resource finder result:', cacheError)
      // Continue without caching - don't fail the request
    }

    // Log usage analytics
    try {
      await supabase
        .from('ai_usage_analytics')
        .insert({
          operation_type: 'resource_finder',
          input_tokens: Math.floor(result.tokens * 0.7), // Estimate
          output_tokens: Math.floor(result.tokens * 0.3), // Estimate
          total_tokens: result.tokens,
          operation_metadata: {
            selected_product,
            selected_purpose,
            has_user_context: !!user_context
          }
        })
    } catch (analyticsError) {
      console.error('Failed to log analytics:', analyticsError)
    }

    return NextResponse.json({
      success: true,
      resources: result.resources,
      trending_insights: result.trending_insights,
      cached: false,
      tokens_used: result.tokens
    })

  } catch (error) {
    console.error('Resource finder API error:', error)
    
    // Return fallback resources
    const fallbackResources = `### 🔗 Official Resources ⭐
- [Salesforce Help Documentation](https://help.salesforce.com) (Updated 2024)
- [Developer Documentation](https://developer.salesforce.com) (Updated 2024)

### 🚀 Trailhead Trails & Modules ⭐
- [Salesforce Fundamentals](https://trailhead.salesforce.com)
- [Platform Basics](https://trailhead.salesforce.com)

### 💡 Implementation Tips & Best Practices
- [Salesforce Success Community](https://success.salesforce.com) (2024-01-15)
- [Best Practices Guide](https://salesforce.com/resources) (2024-01-10)`

    return NextResponse.json({
      success: true,
      resources: fallbackResources,
      trending_insights: 'Currently experiencing high demand in the Salesforce ecosystem.',
      cached: false,
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 }) // Return 200 with fallback data
  }
}