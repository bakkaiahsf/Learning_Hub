/**
 * Intelligent Content Fetcher for Salesforce Learning Resources
 * Fetches and processes content from Trailhead, Developer Docs, and other official sources
 */

import { supabase } from '@/lib/supabase'

interface ContentMetadata {
  title?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_time?: string
  category?: string
  badges?: string[]
  last_updated?: string
  author?: string
}

interface FetchedContent {
  url: string
  title: string
  content: string
  content_type: 'trailhead_module' | 'developer_docs' | 'developer_blog' | 'certification_guide' | 'salesforce_plus_video'
  metadata: ContentMetadata
}

/**
 * Extracts clean text content from HTML, removing navigation, ads, etc.
 */
function extractMainContent(html: string, contentType: string): string {
  try {
    // For server-side usage, we'll need to use a different approach
    // This is a simplified version - in production, you'd use a library like cheerio
    
    // Remove script and style elements
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    
    // Remove HTML tags and get text content
    const text = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    return text
  } catch (error) {
    console.error('Error extracting content:', error)
    return html
  }
}

/**
 * Fetches content from a Trailhead module
 */
export async function fetchTrailheadContent(moduleUrl: string): Promise<FetchedContent | null> {
  try {
    const response = await fetch(moduleUrl, {
      headers: {
        'User-Agent': 'SalesforceLearnHub-Bot/1.0',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    const content = extractMainContent(html, 'trailhead')
    
    // Extract metadata from Trailhead page structure
    const metadata: ContentMetadata = {
      difficulty: extractDifficulty(html),
      estimated_time: extractEstimatedTime(html),
      badges: extractBadges(html),
      last_updated: new Date().toISOString(),
    }
    
    const title = extractTitle(html) || 'Trailhead Module'
    
    return {
      url: moduleUrl,
      title,
      content,
      content_type: 'trailhead_module',
      metadata
    }
  } catch (error) {
    console.error(`Error fetching Trailhead content from ${moduleUrl}:`, error)
    return null
  }
}

/**
 * Fetches content from Salesforce Developer Documentation
 */
export async function fetchDeveloperDocsContent(docUrl: string): Promise<FetchedContent | null> {
  try {
    const response = await fetch(docUrl, {
      headers: {
        'User-Agent': 'SalesforceLearnHub-Bot/1.0',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    const content = extractMainContent(html, 'developer_docs')
    
    const metadata: ContentMetadata = {
      category: extractCategory(html),
      last_updated: new Date().toISOString(),
    }
    
    const title = extractTitle(html) || 'Developer Documentation'
    
    return {
      url: docUrl,
      title,
      content,
      content_type: 'developer_docs',
      metadata
    }
  } catch (error) {
    console.error(`Error fetching Developer Docs content from ${docUrl}:`, error)
    return null
  }
}

/**
 * Saves fetched content to the database
 */
export async function saveContentToDatabase(content: FetchedContent): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('raw_content')
      .upsert({
        source_url: content.url,
        content_type: content.content_type,
        title: content.title,
        raw_text: content.content,
        metadata: content.metadata,
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error saving content to database:', error)
      return null
    }
    
    return data.id
  } catch (error) {
    console.error('Database save error:', error)
    return null
  }
}

/**
 * Batch fetches content from multiple URLs
 */
export async function batchFetchContent(
  urls: string[], 
  onProgress?: (completed: number, total: number) => void
): Promise<FetchedContent[]> {
  const results: FetchedContent[] = []
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    let content: FetchedContent | null = null
    
    if (url.includes('trailhead.salesforce.com')) {
      content = await fetchTrailheadContent(url)
    } else if (url.includes('developer.salesforce.com')) {
      content = await fetchDeveloperDocsContent(url)
    }
    
    if (content) {
      results.push(content)
      // Save to database
      await saveContentToDatabase(content)
    }
    
    // Call progress callback
    if (onProgress) {
      onProgress(i + 1, urls.length)
    }
    
    // Rate limiting - be respectful to Salesforce servers
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}

/**
 * Gets curated list of essential Salesforce learning URLs
 */
export function getEssentialSalesforceUrls(): string[] {
  return [
    // Admin Essentials
    'https://trailhead.salesforce.com/content/learn/modules/admin_essentials',
    'https://trailhead.salesforce.com/content/learn/modules/user_management_tools',
    'https://trailhead.salesforce.com/content/learn/modules/profiles_permission_sets',
    'https://trailhead.salesforce.com/content/learn/modules/data_security',
    'https://trailhead.salesforce.com/content/learn/modules/sharing_security',
    
    // Development Fundamentals
    'https://trailhead.salesforce.com/content/learn/modules/apex_fundamentals',
    'https://trailhead.salesforce.com/content/learn/modules/lwc_get_started',
    'https://trailhead.salesforce.com/content/learn/modules/visualforce_fundamentals',
    'https://trailhead.salesforce.com/content/learn/modules/soql_sosl',
    
    // Platform Development
    'https://trailhead.salesforce.com/content/learn/modules/apex_testing',
    'https://trailhead.salesforce.com/content/learn/modules/apex_triggers',
    'https://trailhead.salesforce.com/content/learn/modules/lwc_composition',
    'https://trailhead.salesforce.com/content/learn/modules/flow_fundamentals',
    
    // Sales Cloud
    'https://trailhead.salesforce.com/content/learn/modules/leads_opportunities',
    'https://trailhead.salesforce.com/content/learn/modules/campaigns',
    'https://trailhead.salesforce.com/content/learn/modules/sales_processes',
    
    // Service Cloud
    'https://trailhead.salesforce.com/content/learn/modules/service_cases',
    'https://trailhead.salesforce.com/content/learn/modules/omni_channel',
    'https://trailhead.salesforce.com/content/learn/modules/einstein_case_classification',
    
    // Marketing Cloud
    'https://trailhead.salesforce.com/content/learn/modules/email_studio_basics',
    'https://trailhead.salesforce.com/content/learn/modules/journey_builder_basics',
    'https://trailhead.salesforce.com/content/learn/modules/automation_studio',
    
    // Integration & APIs
    'https://trailhead.salesforce.com/content/learn/modules/api_basics',
    'https://trailhead.salesforce.com/content/learn/modules/rest_api',
    'https://trailhead.salesforce.com/content/learn/modules/integration_architecture',
    
    // Developer Documentation
    'https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.get_started_introduction',
    'https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro.htm',
    'https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm',
    'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm',
  ]
}

// Helper functions for extracting metadata

function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  if (h1Match) {
    return h1Match[1].replace(/<[^>]*>/g, '').trim()
  }
  
  return null
}

function extractDifficulty(html: string): 'Beginner' | 'Intermediate' | 'Advanced' | undefined {
  if (html.toLowerCase().includes('beginner') || html.toLowerCase().includes('basic')) {
    return 'Beginner'
  }
  if (html.toLowerCase().includes('intermediate')) {
    return 'Intermediate'
  }
  if (html.toLowerCase().includes('advanced')) {
    return 'Advanced'
  }
  return undefined
}

function extractEstimatedTime(html: string): string | undefined {
  const timeMatch = html.match(/(\d+)\s*(hour|hr|min|minute)s?/i)
  if (timeMatch) {
    return `${timeMatch[1]} ${timeMatch[2]}${timeMatch[1] !== '1' ? 's' : ''}`
  }
  return undefined
}

function extractBadges(html: string): string[] {
  const badges: string[] = []
  // This would need to be customized based on actual Trailhead HTML structure
  return badges
}

function extractCategory(html: string): string | undefined {
  // Extract category from developer docs navigation or metadata
  if (html.includes('Lightning Web Components') || html.includes('LWC')) {
    return 'Lightning Web Components'
  }
  if (html.includes('Apex')) {
    return 'Apex Development'
  }
  if (html.includes('API')) {
    return 'APIs and Integration'
  }
  return undefined
}

/**
 * Searches for content in the database and returns relevant results
 */
export async function searchStoredContent(
  query: string, 
  contentType?: string,
  limit: number = 10
): Promise<any[]> {
  try {
    let queryBuilder = supabase
      .from('raw_content')
      .select('*')
      .or(`title.ilike.%${query}%,raw_text.ilike.%${query}%`)
      .order('fetched_at', { ascending: false })
      .limit(limit)
    
    if (contentType) {
      queryBuilder = queryBuilder.eq('content_type', contentType)
    }
    
    const { data, error } = await queryBuilder
    
    if (error) {
      console.error('Error searching content:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

/**
 * Gets random learning content for discovery
 */
export async function getRandomLearningContent(limit: number = 5): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('raw_content')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(limit * 3) // Get more to randomize from
    
    if (error || !data) {
      return []
    }
    
    // Simple randomization
    const shuffled = data.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, limit)
  } catch (error) {
    console.error('Error getting random content:', error)
    return []
  }
}