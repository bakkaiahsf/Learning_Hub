import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if we have recent news (within 7 days)
    const { data: existingNews, error: fetchError } = await supabase
      .from('salesforce_news_feed')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    if (fetchError) {
      console.error('Error fetching existing news:', fetchError)
    }

    // If we have recent news, return it
    if (existingNews && existingNews.length > 0) {
      return NextResponse.json({
        success: true,
        news: existingNews,
        lastUpdated: existingNews[0]?.created_at,
        fromCache: true
      })
    }

    // Otherwise, fetch fresh news (in production, this would scrape salesforce.com/news)
    // For now, we'll return mock news and store it
    const mockNews = [
      {
        title: "Salesforce Announces Agentforce 2.0: The Future of AI-Powered Customer Success",
        summary: "New capabilities include advanced reasoning, multi-modal interactions, and deeper CRM integration. Agentforce 2.0 represents a significant leap forward in autonomous AI agents for business.",
        url: "https://www.salesforce.com/news/stories/agentforce-2-announcement/",
        published_date: new Date().toISOString(),
        category: "Product Launch"
      },
      {
        title: "Salesforce Reports Record Q4 Results with 11% Revenue Growth",
        summary: "Strong performance across all clouds driven by AI innovation and customer success initiatives. The company continues to lead in the CRM space with expanding market share.",
        url: "https://www.salesforce.com/news/press-releases/2024/earnings-q4/",
        published_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        category: "Financial"
      },
      {
        title: "New Einstein GPT Features Revolutionize Sales Cloud Automation",
        summary: "Advanced AI capabilities now automatically generate personalized emails, predict deal outcomes, and recommend next best actions for sales teams worldwide.",
        url: "https://www.salesforce.com/news/stories/einstein-gpt-sales-cloud/",
        published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: "AI Innovation"
      },
      {
        title: "Salesforce Sustainability Cloud Helps Companies Achieve Net Zero Goals",
        summary: "Enhanced carbon accounting features and automated ESG reporting capabilities support organizations in their journey toward environmental sustainability.",
        url: "https://www.salesforce.com/news/stories/sustainability-cloud-net-zero/",
        published_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Sustainability"
      },
      {
        title: "Dreamforce 2024 Highlights: AI, Innovation, and Customer Success",
        summary: "Key announcements include new AI agents, platform improvements, and success stories from customers leveraging Salesforce technology for digital transformation.",
        url: "https://www.salesforce.com/news/stories/dreamforce-2024-highlights/",
        published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Events"
      }
    ]

    // Store the news in database
    const { data: insertedNews, error: insertError } = await supabase
      .from('salesforce_news_feed')
      .insert(mockNews.map(news => ({
        ...news,
        ai_summary: news.summary,
        source: 'salesforce.com'
      })))
      .select()

    if (insertError) {
      console.error('Error inserting news:', insertError)
      // Return mock data even if we can't store it
      return NextResponse.json({
        success: true,
        news: mockNews,
        lastUpdated: new Date().toISOString(),
        fromCache: false
      })
    }

    return NextResponse.json({
      success: true,
      news: insertedNews || mockNews,
      lastUpdated: new Date().toISOString(),
      fromCache: false
    })

  } catch (error) {
    console.error('Salesforce news API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Salesforce news' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { forceRefresh } = await request.json()
    
    if (forceRefresh) {
      // Delete old news (older than 7 days)
      await supabase
        .from('salesforce_news_feed')
        .delete()
        .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      
      // This would trigger a fresh fetch in production
      return GET()
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Force refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}