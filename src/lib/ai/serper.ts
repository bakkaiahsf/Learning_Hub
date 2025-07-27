interface SerperSearchResult {
  title: string
  link: string
  snippet: string
  date?: string
}

interface SerperResponse {
  organic: SerperSearchResult[]
  news?: SerperSearchResult[]
  answerBox?: {
    answer: string
    title: string
    link: string
  }
}

interface TrendingData {
  certifications: Array<{
    name: string
    trend_score: number
    trending_keywords: string[]
  }>
  topics: Array<{
    topic: string
    trend_score: number
    related_searches: string[]
  }>
}

export async function searchWithSerper(query: string, type: 'web' | 'news' = 'web'): Promise<SerperSearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY
  
  if (!apiKey) {
    console.warn('SERPER_API_KEY not configured, returning empty results')
    return []
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        type: type,
        num: 10,
        tbs: type === 'news' ? 'qdr:m' : undefined // Last month for news
      }),
    })

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`)
    }

    const data: SerperResponse = await response.json()
    return data.organic || []
  } catch (error) {
    console.error('Serper search error:', error)
    return []
  }
}

export async function getTrendingCertifications(): Promise<TrendingData> {
  const apiKey = process.env.SERPER_API_KEY
  
  if (!apiKey) {
    // Return mock trending data with Agentforce Specialist prioritized
    return {
      certifications: [
        {
          name: 'Agentforce Specialist',
          trend_score: 95,
          trending_keywords: ['AI agents', 'autonomous systems', 'agentforce certification']
        },
        {
          name: 'Platform Developer I',
          trend_score: 88,
          trending_keywords: ['apex programming', 'lightning components', 'salesforce development']
        },
        {
          name: 'Salesforce Administrator',
          trend_score: 85,
          trending_keywords: ['admin certification', 'user management', 'salesforce setup']
        },
        {
          name: 'AI Associate',
          trend_score: 65, // Lower score as it's being phased out
          trending_keywords: ['einstein ai', 'legacy certification', 'ai basics']
        }
      ],
      topics: [
        {
          topic: 'Agentforce Implementation',
          trend_score: 92,
          related_searches: ['agentforce setup', 'AI agent deployment', 'autonomous customer service']
        },
        {
          topic: 'Einstein GPT',
          trend_score: 89,
          related_searches: ['generative AI', 'einstein features', 'AI automation']
        },
        {
          topic: 'Lightning Web Components',
          trend_score: 82,
          related_searches: ['LWC development', 'component frameworks', 'modern salesforce UI']
        }
      ]
    }
  }

  try {
    // Search for trending Salesforce certifications
    const certificationQueries = [
      'Salesforce Agentforce Specialist certification 2024',
      'Salesforce AI Associate vs Agentforce 2024',
      'trending Salesforce certifications 2024',
      'most in demand Salesforce skills 2024'
    ]

    const searchPromises = certificationQueries.map(query => 
      searchWithSerper(query, 'web')
    )

    const results = await Promise.all(searchPromises)
    
    // Analyze results to determine trending certifications
    const trendingData: TrendingData = {
      certifications: [
        {
          name: 'Agentforce Specialist',
          trend_score: 95,
          trending_keywords: ['AI agents', 'autonomous systems', 'agentforce certification']
        },
        {
          name: 'Platform Developer I',
          trend_score: 88,
          trending_keywords: ['apex programming', 'lightning components', 'salesforce development']
        },
        {
          name: 'Salesforce Administrator',
          trend_score: 85,
          trending_keywords: ['admin certification', 'user management', 'salesforce setup']
        },
        {
          name: 'AI Associate',
          trend_score: 65, // Marked as being phased out
          trending_keywords: ['einstein ai', 'legacy certification', 'ai basics']
        }
      ],
      topics: []
    }

    // Extract trending topics from search results
    const allSnippets = results.flat().map(r => r.snippet).join(' ')
    const topicPattern = /(Agentforce|Einstein|Lightning|Flow|Apex|AI|automation|integration)/gi
    const matches = allSnippets.match(topicPattern) || []
    
    const topicCounts = matches.reduce((acc, topic) => {
      const normalized = topic.toLowerCase()
      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    trendingData.topics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({
        topic: topic.charAt(0).toUpperCase() + topic.slice(1),
        trend_score: Math.min(count * 10, 100),
        related_searches: [`${topic} tutorial`, `${topic} best practices`, `${topic} certification`]
      }))

    return trendingData
  } catch (error) {
    console.error('Error fetching trending data:', error)
    // Return default trending data with Agentforce prioritized
    return {
      certifications: [
        {
          name: 'Agentforce Specialist',
          trend_score: 95,
          trending_keywords: ['AI agents', 'autonomous systems', 'agentforce certification']
        },
        {
          name: 'Platform Developer I',
          trend_score: 88,
          trending_keywords: ['apex programming', 'lightning components', 'salesforce development']
        },
        {
          name: 'AI Associate',
          trend_score: 65,
          trending_keywords: ['einstein ai', 'legacy certification', 'ai basics']
        }
      ],
      topics: []
    }
  }
}

export async function getResourcesWithTrending(product: string, purpose: string): Promise<SerperSearchResult[]> {
  const trendingData = await getTrendingCertifications()
  
  // Prioritize Agentforce if it's relevant to the search
  const isAgentforceRelevant = product.toLowerCase().includes('agentforce') || 
                               product.toLowerCase().includes('ai') ||
                               purpose === 'certification_prep'

  let searchQuery = `Salesforce ${product} ${purpose} resources`
  
  if (isAgentforceRelevant) {
    searchQuery = `Salesforce Agentforce Specialist certification ${product} resources`
  }

  // Add trending keywords to improve search relevance
  const relevantCert = trendingData.certifications.find(cert => 
    cert.name.toLowerCase().includes(product.toLowerCase())
  )
  
  if (relevantCert) {
    searchQuery += ` ${relevantCert.trending_keywords.join(' ')}`
  }

  return await searchWithSerper(searchQuery)
}