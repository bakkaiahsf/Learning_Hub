/**
 * DeepSeek AI Integration for SalesforceLearnHub
 * Provides intelligent content generation, summarization, and learning path creation
 * Updated to prioritize Agentforce Specialist certification (2024)
 */

import { searchWithSerper, getTrendingCertifications, getResourcesWithTrending } from './serper'

interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatCompletionResponse {
  choices: { 
    message: ChatCompletionMessage
    finish_reason: string
  }[]
  usage: { 
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
  id: string
}

interface LearningPathModule {
  title: string
  description: string
  trailhead_link?: string
  developer_docs_link?: string
  estimated_time: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  key_concepts: string[]
  prerequisites?: string[]
}

interface GeneratedLearningPath {
  title: string
  description: string
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_total_duration: string
  modules: LearningPathModule[]
  certification_alignment?: string[]
  next_steps?: string[]
}

interface FlashcardData {
  question: string
  answer: string
  explanation?: string
  tags: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  certification_relevance?: string[]
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_BASE_URL = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1'

if (!DEEPSEEK_API_KEY) {
  console.warn('DEEPSEEK_API_KEY not found in environment variables')
}

/**
 * Makes a chat completion request to DeepSeek AI
 */
export async function getDeepSeekChatCompletion(
  messages: ChatCompletionMessage[],
  model: string = 'deepseek-chat',
  max_tokens: number = 4000,
  temperature: number = 0.7
): Promise<ChatCompletionResponse> {
  try {
    const response = await fetch(`${DEEPSEEK_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calling DeepSeek API:', error)
    throw new Error('Failed to get DeepSeek chat completion')
  }
}

/**
 * Intelligently summarizes Salesforce learning content
 */
export async function summarizeContent(
  content: string, 
  length: 'short' | 'medium' | 'long' = 'medium',
  focus?: string
): Promise<{ summary: string; key_concepts: string[]; tokens: number }> {
  const lengthInstructions = {
    short: 'in 2-3 concise sentences',
    medium: 'in 1-2 paragraphs with key details',
    long: 'in 3-4 detailed paragraphs with comprehensive coverage'
  }

  const focusInstruction = focus ? `Focus specifically on ${focus} aspects.` : ''
  
  const prompt = `As an expert Salesforce learning coach, summarize the following content ${lengthInstructions[length]}. 
  Extract the most important concepts and learning objectives. ${focusInstruction}
  
  Content: ${content}
  
  Please respond with a JSON object containing:
  - summary: the main summary text
  - key_concepts: array of 3-7 key concepts/terms covered
  
  Focus on practical application and certification relevance.`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are an expert Salesforce learning coach who creates clear, actionable summaries focused on practical application and certification preparation. Always respond with valid JSON.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-chat', 2000, 0.3)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      summary: result.summary, 
      key_concepts: result.key_concepts || [],
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse summary JSON:', response.choices[0].message.content)
    return {
      summary: response.choices[0].message.content,
      key_concepts: [],
      tokens: response.usage.total_tokens
    }
  }
}

/**
 * Generates interactive flashcards for certification preparation
 */
export async function generateFlashcards(
  content: string, 
  topic: string, 
  numCards: number = 10,
  certification?: string
): Promise<{ flashcards: FlashcardData[]; tokens: number }> {
  
  const certFocus = certification ? `Focus on ${certification} certification requirements.` : ''
  
  const prompt = `As an expert Salesforce instructor, create ${numCards} high-quality flashcards based on the following content for the topic "${topic}".
  
  ${certFocus}
  
  Content: ${content}
  
  Create flashcards that:
  - Test understanding of key concepts, not just memorization
  - Include practical scenarios where applicable
  - Cover different difficulty levels
  - Are relevant for certification preparation
  - Include clear, concise questions and comprehensive answers
  
  Respond with a JSON object containing a "flashcards" array where each flashcard has:
  - question: clear, specific question
  - answer: comprehensive but concise answer
  - explanation: optional additional context (if helpful)
  - tags: array of relevant topic tags
  - difficulty: "Easy", "Medium", or "Hard"
  - certification_relevance: array of certifications this applies to (if applicable)
  
  Ensure variety in question types: definitions, scenarios, best practices, and troubleshooting.`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are an expert Salesforce certification instructor who creates high-quality, practical flashcards that help students succeed in real-world scenarios and certification exams. Always respond with valid JSON.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-reasoner', 6000, 0.4)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      flashcards: result.flashcards || [],
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse flashcards JSON:', response.choices[0].message.content)
    throw new Error('Failed to generate flashcards in expected format.')
  }
}

/**
 * Generates personalized learning paths based on user goals and experience
 */
export async function generateLearningPath(
  userPrompt: string, 
  existingKnowledge: string = '',
  preferredLearningStyle?: string,
  timeCommitment?: string
): Promise<{ path: GeneratedLearningPath; tokens: number }> {
  
  const styleNote = preferredLearningStyle ? `Learning style preference: ${preferredLearningStyle}.` : ''
  const timeNote = timeCommitment ? `Available time commitment: ${timeCommitment}.` : ''
  
  const prompt = `As an expert Salesforce learning architect, create a comprehensive, personalized learning path based on:

  Goal: "${userPrompt}"
  Current Knowledge: "${existingKnowledge}"
  ${styleNote}
  ${timeNote}
  
  Create a structured learning path that includes:
  - Logical progression from fundamentals to advanced concepts
  - Integration of Trailhead modules, Developer documentation, and hands-on practice
  - Real-world application scenarios
  - Certification preparation alignment
  - Realistic time estimates
  
  Use actual Trailhead URLs where possible (e.g., https://trailhead.salesforce.com/content/learn/modules/[module-name])
  Include Developer documentation links (e.g., https://developer.salesforce.com/docs/[relevant-section])
  
  Respond with a JSON object containing:
  {
    "title": "Learning Path Title",
    "description": "Brief overview of what learner will achieve",
    "difficulty_level": "Beginner|Intermediate|Advanced",
    "estimated_total_duration": "X hours/weeks",
    "modules": [
      {
        "title": "Module name",
        "description": "What this module covers",
        "trailhead_link": "actual Trailhead URL if applicable",
        "developer_docs_link": "actual Developer docs URL if applicable", 
        "estimated_time": "X hours",
        "difficulty": "Beginner|Intermediate|Advanced",
        "key_concepts": ["concept1", "concept2"],
        "prerequisites": ["prereq1", "prereq2"] // optional
      }
    ],
    "certification_alignment": ["relevant certifications"],
    "next_steps": ["suggestions for after completion"]
  }
  
  Ensure the path is practical, achievable, and aligned with current Salesforce best practices.`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are an expert Salesforce learning architect with deep knowledge of all Salesforce products, certifications, and learning resources. You create practical, achievable learning paths that lead to real-world success. Always respond with valid JSON and use actual Salesforce URLs where possible.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-reasoner', 8000, 0.6)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      path: result,
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse learning path JSON:', response.choices[0].message.content)
    throw new Error('Failed to generate learning path in expected format.')
  }
}

/**
 * Enhances search results with AI-powered context and recommendations
 */
export async function enhanceSearchResults(
  query: string,
  searchResults: any[],
  userContext?: string
): Promise<{ enhanced_response: string; recommendations: string[]; tokens: number }> {
  
  const contextNote = userContext ? `User context: ${userContext}` : ''
  
  const prompt = `As a Salesforce learning assistant, enhance these search results for the query "${query}".
  
  ${contextNote}
  
  Search Results: ${JSON.stringify(searchResults)}
  
  Provide:
  1. A conversational response that synthesizes the search results
  2. Practical recommendations for next steps
  3. Connections between different results
  4. Learning path suggestions
  
  Respond with JSON:
  {
    "enhanced_response": "conversational explanation of results",
    "recommendations": ["specific next step recommendations"]
  }`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are a helpful Salesforce learning assistant who provides clear, practical guidance. Always respond with valid JSON.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-chat', 2000, 0.7)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      enhanced_response: result.enhanced_response,
      recommendations: result.recommendations || [],
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse search enhancement JSON:', response.choices[0].message.content)
    return {
      enhanced_response: response.choices[0].message.content,
      recommendations: [],
      tokens: response.usage.total_tokens
    }
  }
}

/**
 * Analyzes user progress and suggests personalized improvements
 */
export async function analyzeProgressAndSuggest(
  userProgress: any,
  learningGoals: string[]
): Promise<{ analysis: string; suggestions: string[]; tokens: number }> {
  
  const prompt = `As a Salesforce learning coach, analyze this user's progress and provide personalized suggestions.
  
  Progress Data: ${JSON.stringify(userProgress)}
  Learning Goals: ${learningGoals.join(', ')}
  
  Provide:
  1. Analysis of current progress and patterns
  2. Specific, actionable suggestions for improvement
  3. Recommended focus areas
  4. Motivational insights
  
  Respond with JSON:
  {
    "analysis": "detailed progress analysis",
    "suggestions": ["specific improvement suggestions"]
  }`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are an expert learning coach who provides encouraging, specific, and actionable feedback. Always respond with valid JSON.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-chat', 1500, 0.6)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      analysis: result.analysis,
      suggestions: result.suggestions || [],
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse progress analysis JSON:', response.choices[0].message.content)
    return {
      analysis: response.choices[0].message.content,
      suggestions: [],
      tokens: response.usage.total_tokens
    }
  }
}

/**
 * Resource Finder AI Agent - Enhanced for 2024 with Agentforce prioritization
 * Finds the best learning resources with live trending data
 */
export async function findLearningResources(
  selectedProduct: string,
  selectedPurpose: string
): Promise<{ resources: string; trending_insights: string; tokens: number }> {
  
  // Get trending data first to inform our search
  const trendingData = await getTrendingCertifications()
  
  // Get enhanced search results with trending context
  const searchResults = await getResourcesWithTrending(selectedProduct, selectedPurpose)
  
  // Check if Agentforce is relevant and prioritize it
  const isAgentforceRelevant = selectedProduct.toLowerCase().includes('agentforce') || 
                               selectedProduct.toLowerCase().includes('ai') ||
                               selectedPurpose === 'certification_prep'

  const agentforceNote = isAgentforceRelevant ? 
    "\n\nIMPORTANT: Agentforce Specialist is the top trending AI certification and should lead your recommendations. AI Associate is nearing retirement—still relevant for legacy learners, but being phased out." : ""

  const prompt = `Act as a seasoned Salesforce Learning Curator. A user is preparing for "${selectedProduct}" with the goal of "${selectedPurpose}". Your mission is to find the best learning resources to help them succeed!

Here's how to accomplish this:

1. **Resource Identification:** Focus on these key resource types:
   - **Official Salesforce Documentation:** The definitive source of truth.
   - **Trailhead Learning Paths & Modules:** Hands-on, guided learning experiences.
   - **Certification Exam Guides (if applicable):** Essential for certification prep.
   - **Implementation Guides & Best Practices:** Real-world advice from Salesforce experts.
   - **Active Salesforce Community Discussions:** Insights from fellow Salesforce professionals.
   - **Engaging Video Tutorials:** Visual learning for complex topics.

${agentforceNote}

2. **Current Trending Context:** ${JSON.stringify(trendingData, null, 2)}

3. **Live Search Results:** ${JSON.stringify(searchResults.slice(0, 10), null, 2)}

4. **Web Search Strategy:** Conduct focused web searches using these queries:
   - "Salesforce ${selectedProduct} ${selectedPurpose} resources"
   - "${selectedProduct} implementation guide"
   - "${selectedProduct} trailhead learning path"
   - "${selectedProduct} certification guide" (if certification_prep is the selected purpose)
   - "${selectedProduct} best practices"

5. **Output Format (Critical):** Deliver results in this precise format:

\`\`\`
### 🔗 Official Resources ⭐
- [Resource Title](https://example.com) (Updated YYYY)

### 🚀 Trailhead Trails & Modules ⭐
- [Trail Name](https://trailhead.salesforce.com)

### 💡 Implementation Tips & Best Practices
- [Blog Post Title](https://blog.com) (YYYY-MM-DD)

### 💬 Community Discussions
- [Discussion Title](https://community.salesforce.com) (YYYY-MM-DD)

### 📺 Video Tutorials
- [Video Title](https://youtube.com) (Published YYYY-MM-DD)
\`\`\`

6. **Strict Rules:**
   - **Hyperlinked Titles Only:** Provide *only* hyperlinked titles; no descriptions.
   - **Active URLs Only:** Ensure all URLs return a status code of 200 (active).
   - **Salesforce Priority:** Prioritize resources from Salesforce domains (trailhead.salesforce.com, help.salesforce.com, developer.salesforce.com, success.salesforce.com, and salesforce.com).
   - **Maximum Resources:** Limit the total number of resources to a maximum of 10.
   - **Essential Resource Marker:** Mark truly essential resources with a ⭐. Place this next to the category header for the most important resources in that category.
   - **Date Inclusion:** Include publication or last updated dates (YYYY-MM-DD or Updated YYYY) when available.
   - **Category Minimum:** Only include categories with 2 or more relevant resources.

Let's find the best resources for "${selectedProduct}" and the goal of "${selectedPurpose}"!

Also provide trending insights about why this product/certification is currently relevant in the Salesforce ecosystem.

Respond with JSON:
{
  "resources": "formatted resource list as specified above",
  "trending_insights": "analysis of current trends and relevance"
}`

  const messages: ChatCompletionMessage[] = [
    { 
      role: 'system', 
      content: 'You are a seasoned Salesforce Learning Curator with deep knowledge of the current Salesforce ecosystem. Always respond with valid JSON and prioritize the most current and relevant resources.'
    },
    { role: 'user', content: prompt }
  ]

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-reasoner', 3000, 0.3)
  
  try {
    const result = JSON.parse(response.choices[0].message.content)
    return { 
      resources: result.resources,
      trending_insights: result.trending_insights || '',
      tokens: response.usage.total_tokens 
    }
  } catch (e) {
    console.error('Failed to parse resource finder JSON:', response.choices[0].message.content)
    
    // Return formatted fallback response
    const fallbackResources = `### 🔗 Official Resources ⭐
- [Salesforce ${selectedProduct} Documentation](https://help.salesforce.com) (Updated 2024)
- [${selectedProduct} Implementation Guide](https://developer.salesforce.com) (Updated 2024)

### 🚀 Trailhead Trails & Modules ⭐
- [${selectedProduct} Learning Path](https://trailhead.salesforce.com)
- [${selectedProduct} Specialist Trail](https://trailhead.salesforce.com)

### 💡 Implementation Tips & Best Practices
- [${selectedProduct} Best Practices Guide](https://success.salesforce.com) (2024-01-15)
- [Expert Tips for ${selectedProduct}](https://salesforce.com/blog) (2024-01-10)`

    return {
      resources: fallbackResources,
      trending_insights: `${selectedProduct} is currently trending in the Salesforce ecosystem, particularly for ${selectedPurpose} purposes.`,
      tokens: response.usage.total_tokens
    }
  }
}