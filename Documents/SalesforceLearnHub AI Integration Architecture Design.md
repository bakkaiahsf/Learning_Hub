# SalesforceLearnHub AI Integration Architecture Design

**Author:** Manus AI  
**Date:** July 27, 2025  

## 1. Introduction

This document outlines the architectural design for integrating advanced AI capabilities into the SalesforceLearnHub platform. The primary objective is to enhance the learning experience by dynamically generating personalized learning paths, summarizing content, and creating flashcards for interviews and certifications. This will be achieved by leveraging content from Salesforce Trailhead, Developer Documentation, and Salesforce+ videos, with a strong focus on cost optimization through strategic AI API selection.

## 2. AI Capabilities and Requirements

To make the SalesforceLearnHub truly intelligent, the following AI-powered features are envisioned:

### 2.1. Dynamic Learning Path Generation

-   **Requirement**: Users should be able to ask for a learning path (e.g., 



    "I want to become a Salesforce Marketing Cloud Specialist").
-   **AI Functionality**: The AI should leverage content from Trailhead, Developer Docs, and Salesforce+ to create a tailored learning path, including relevant modules, badges, and projects.
-   **Output**: A structured learning path, potentially with estimated timeframes and prerequisites.

### 2.2. Intelligent Content Summarization

-   **Requirement**: Users should be able to get concise summaries of long-form content (e.g., Trailhead modules, developer blogs, Salesforce+ video transcripts).
-   **AI Functionality**: The AI should process large volumes of text/transcripts and extract key information, concepts, and actionable insights.
-   **Output**: A brief, accurate summary that captures the essence of the original content.

### 2.3. Dynamic Flashcard Generation

-   **Requirement**: Users should be able to generate flashcards for interview preparation and certification exams based on specific topics or official Salesforce certification guides.
-   **AI Functionality**: The AI should identify key terms, definitions, concepts, and potential interview questions from the learning content and format them into Q&A pairs.
-   **Output**: A set of digital flashcards, categorized by topic or certification, ready for review.

## 3. Data Sources

To power these AI capabilities, the system will need to ingest and process data from various Salesforce-related sources:

-   **Salesforce Trailhead**: Official learning platform with modules, trails, and trailmixes. Data will include module content, quizzes, and learning objectives.
-   **Salesforce Developer Documentation**: Comprehensive documentation for Apex, Lightning Web Components, APIs, and other developer tools. This includes conceptual guides, reference materials, and code examples.
-   **Salesforce Developer Blogs**: Articles and insights from Salesforce developers, often containing practical examples and best practices.
-   **Salesforce+ Videos**: Video content from official Salesforce events, webinars, and training sessions. This will require transcription and processing of video content.
-   **Salesforce Official Certification Guides**: Structured content outlining the objectives and topics covered in various Salesforce certification exams.

## 4. AI API Selection and Cost Optimization

Based on the research, DeepSeek AI and other alternatives (OpenAI, Anthropic, Google Gemini, Cohere) offer suitable capabilities. For cost optimization, a multi-model strategy or careful selection based on specific task requirements and pricing tiers will be crucial.

### 4.1. DeepSeek AI Analysis

DeepSeek AI offers competitive pricing, especially with its off-peak discounts. Its `deepseek-chat` and `deepseek-reasoner` models are suitable for various NLP tasks.

| Model           | Context Length | Max Output | Standard Price (1M Input Tokens) | Discount Price (1M Input Tokens) |
|-----------------|----------------|------------|----------------------------------|----------------------------------|
| `deepseek-chat` | 64K            | 8K         | $0.27 (Cache Miss)               | $0.135 (Cache Miss)              |
| `deepseek-reasoner` | 64K            | 64K        | $0.55 (Cache Miss)               | $0.135 (Cache Miss)              |

**Pros:**
-   Competitive pricing, especially during off-peak hours.
-   `deepseek-reasoner` offers a larger max output, beneficial for detailed summaries or flashcard generation.
-   Supports JSON output and function calling, which can be useful for structured responses.

**Cons:**
-   Less established than OpenAI or Google in terms of ecosystem and community support.
-   Performance for highly nuanced Salesforce-specific content needs to be thoroughly evaluated.

### 4.2. Alternative AI APIs

-   **OpenAI (GPT-4o, GPT-3.5 Turbo)**:
    -   **Pros**: Industry leader, highly capable models for summarization, Q&A, and content generation. Extensive documentation and community support.
    -   **Cons**: Generally higher pricing, though recent models like GPT-4o are more cost-effective. Rate limits can be a concern for high-volume usage.

-   **Anthropic (Claude 3 Haiku, Sonnet, Opus)**:
    -   **Pros**: Strong performance in long-context understanding and complex reasoning. Haiku is very cost-effective for its capabilities.
    -   **Cons**: Newer to the market, less mature ecosystem compared to OpenAI.

-   **Google Gemini API**: 
    -   **Pros**: Excellent for multimodal tasks (though not directly required for text-based summarization/flashcards). Competitive pricing for text models.
    -   **Cons**: May require Google Cloud Platform integration for advanced features.

-   **Cohere**: 
    -   **Pros**: Strong focus on enterprise AI, good for RAG (Retrieval Augmented Generation) and semantic search.
    -   **Cons**: May be more geared towards specific enterprise use cases.

### 4.3. Cost Optimization Strategy

To optimize costs, a hybrid approach is recommended:

1.  **Primary Model (DeepSeek AI)**: Utilize DeepSeek AI for general summarization and flashcard generation due to its cost-effectiveness, especially for bulk processing during off-peak hours.
2.  **Fallback/Specialized Model (OpenAI/Anthropic)**: For highly complex queries, nuanced content, or critical path operations, consider using OpenAI or Anthropic models. This provides a balance between cost and performance.
3.  **Context Caching**: Leverage DeepSeek AI's context caching feature to reduce input token costs for repetitive queries.
4.  **Prompt Engineering**: Optimize prompts to minimize token usage while maximizing output quality.
5.  **Batch Processing**: For content summarization and flashcard generation, process content in batches to take advantage of volume discounts or off-peak pricing.

## 5. Architectural Components for AI Integration

Integrating AI capabilities will require several new architectural components and modifications to the existing SalesforceLearnHub system.

### 5.1. Data Ingestion and Processing Layer

This layer will be responsible for collecting, cleaning, and preparing data from various Salesforce sources for AI processing.

-   **Web Scrapers/Connectors**: Automated scripts or services to pull content from:
    -   **Trailhead**: Modules, trails, quizzes (via web scraping or unofficial APIs if available).
    -   **Developer Documentation/Blogs**: Articles, guides, code examples (web scraping).
    -   **Salesforce+**: Video transcripts (requires speech-to-text processing, potentially using a separate service or AI API).
-   **Data Storage (Supabase)**: Ingested and processed data will be stored in new Supabase tables, optimized for AI consumption.
    -   `raw_content`: Stores raw text/transcripts from all sources.
    -   `processed_content`: Stores cleaned, chunked, and embedded content ready for AI models.
    -   `flashcards`: Stores generated flashcards.
    -   `learning_paths_ai`: Stores dynamically generated learning paths.
-   **Data Processing Pipeline**: A series of functions (e.g., Supabase Edge Functions, Node.js microservice) to:
    -   **Text Extraction**: From HTML, PDFs, etc.
    -   **Video Transcription**: From Salesforce+ videos.
    -   **Chunking**: Breaking down large documents into smaller, manageable pieces for AI models.
    -   **Embedding Generation**: Creating vector embeddings of content for semantic search and retrieval (using an embedding model like DeepSeek Embeddings or OpenAI Embeddings).

### 5.2. AI Service Layer (Backend)

This layer will encapsulate the logic for interacting with the chosen AI APIs.

-   **Next.js API Routes (Extended)**: The existing Next.js API routes will be extended or new ones created to handle AI-specific requests.
    -   `/api/ai/generate-path`: Endpoint for dynamic learning path generation.
    -   `/api/ai/summarize`: Endpoint for content summarization.
    -   `/api/ai/generate-flashcards`: Endpoint for flashcard generation.
-   **AI API Clients**: Libraries or custom code to interact with DeepSeek AI, OpenAI, Anthropic, etc.
-   **Prompt Management**: Centralized management of prompts used for different AI tasks to ensure consistency and optimize performance.
-   **Rate Limiting & Caching**: Implement strategies to manage API call rates and cache responses to reduce costs and improve performance.

### 5.3. Frontend Integration (Next.js)

The existing Next.js frontend will be updated to expose the new AI capabilities to users.

-   **New UI Components**: 
    -   **Learning Path Generator**: An interactive form where users can specify their goals and receive a dynamic learning path.
    -   **Content Summarizer**: An interface where users can input content (or link to it) and get a summary.
    -   **Flashcard Creator/Viewer**: A section for generating and reviewing flashcards.
-   **API Calls**: Frontend components will make calls to the new AI service layer API routes.
-   **State Management**: Manage the state of AI requests (loading, success, error) and display results to the user.

## 6. Supabase Schema Extensions for AI Features

New tables will be required in Supabase to store AI-generated content and manage the AI pipeline.

### 6.1. `ai_generated_learning_paths` Table

| Column Name | Data Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for the generated path |
| `user_id` | UUID | User who requested the path (FK to `users` table) |
| `request_prompt` | Text | The user's original prompt/goal |
| `generated_content` | JSONB | The structured learning path generated by AI (e.g., array of modules, Trailhead links) |
| `created_at` | Timestamp | Timestamp of generation |
| `cost_in_tokens` | Integer | Number of tokens consumed for generation |
| `ai_model_used` | Text | Name of the AI model used |

### 6.2. `ai_generated_summaries` Table

| Column Name | Data Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for the summary |
| `original_content_id` | UUID | FK to `raw_content` or `processed_content` |
| `summary_text` | Text | The AI-generated summary |
| `created_at` | Timestamp | Timestamp of generation |
| `cost_in_tokens` | Integer | Number of tokens consumed |
| `ai_model_used` | Text | Name of the AI model used |

### 6.3. `ai_generated_flashcards` Table

| Column Name | Data Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for the flashcard set |
| `topic` | Text | Topic or certification related to flashcards |
| `source_content_id` | UUID | FK to `raw_content` or `processed_content` |
| `flashcards_data` | JSONB | Array of Q&A pairs (e.g., `[{ question: 



    "What is Apex?", answer: "Apex is a strongly typed, object-oriented programming language that allows developers to execute flow and transaction control statements on the Salesforce platform.", tags: ["Apex", "Programming"] }]` |
| `created_at` | Timestamp | Timestamp of generation |
| `cost_in_tokens` | Integer | Number of tokens consumed |
| `ai_model_used` | Text | Name of the AI model used |

### 6.4. `raw_content` Table

| Column Name | Data Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for the raw content |
| `source_url` | Text | URL of the original content (e.g., Trailhead module URL, blog post URL) |
| `content_type` | Text | Type of content (e.g., `trailhead_module`, `developer_blog`, `salesforce_plus_video_transcript`, `certification_guide`) |
| `raw_text` | Text | The extracted raw text content |
| `fetched_at` | Timestamp | When the content was fetched |

### 6.5. `processed_content` Table

| Column Name | Data Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for the processed content |
| `raw_content_id` | UUID | FK to `raw_content` table |
| `chunk_text` | Text | A smaller chunk of the raw text |
| `embedding` | Vector | Vector embedding of the `chunk_text` for semantic search |
| `processed_at` | Timestamp | When the content was processed |

## 7. API Endpoints and Data Models for AI Features

### 7.1. `POST /api/ai/generate-learning-path`

**Request Body:**

```json
{
  "user_id": "uuid-of-user",
  "prompt": "I want to become a Salesforce Marketing Cloud Specialist. I have 2 years of experience in email marketing."
}
```

**Response Body (Success - 200 OK):**

```json
{
  "id": "uuid-of-generated-path",
  "user_id": "uuid-of-user",
  "request_prompt": "I want to become a Salesforce Marketing Cloud Specialist. I have 2 years of experience in email marketing.",
  "generated_content": {
    "title": "Personalized Learning Path: Salesforce Marketing Cloud Specialist",
    "description": "Tailored path for experienced email marketers aiming for Marketing Cloud Specialist certification.",
    "modules": [
      {
        "title": "Marketing Cloud Basics",
        "trailhead_link": "https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-basics",
        "estimated_time": "4 hours"
      },
      {
        "title": "Journey Builder Fundamentals",
        "trailhead_link": "https://trailhead.salesforce.com/content/learn/modules/journey-builder-fundamentals",
        "estimated_time": "6 hours"
      }
      // ... more modules
    ]
  },
  "created_at": "2025-07-27T10:00:00Z",
  "cost_in_tokens": 1500,
  "ai_model_used": "deepseek-reasoner"
}
```

**Error Response (400 Bad Request / 500 Internal Server Error):**

```json
{
  "error": "Error message describing the issue"
}
```

### 7.2. `POST /api/ai/summarize`

**Request Body:**

```json
{
  "content_url": "https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.get_started_introduction",
  "text_content": "Optional: direct text content to summarize if no URL is provided.",
  "summary_length": "short" // or "medium", "long"
}
```

**Response Body (Success - 200 OK):**

```json
{
  "id": "uuid-of-summary",
  "original_content_id": "uuid-of-raw-content",
  "summary_text": "This document introduces Lightning Web Components (LWC), a modern framework for building Salesforce UI. It covers key concepts like component composition, reactive programming, and integration with the Salesforce platform.",
  "created_at": "2025-07-27T10:05:00Z",
  "cost_in_tokens": 500,
  "ai_model_used": "deepseek-chat"
}
```

### 7.3. `POST /api/ai/generate-flashcards`

**Request Body:**

```json
{
  "content_url": "https://trailhead.salesforce.com/content/learn/modules/admin_essentials",
  "text_content": "Optional: direct text content for flashcards.",
  "topic": "Salesforce Admin Certification",
  "num_flashcards": 10
}
```

**Response Body (Success - 200 OK):**

```json
{
  "id": "uuid-of-flashcard-set",
  "topic": "Salesforce Admin Certification",
  "source_content_id": "uuid-of-raw-content",
  "flashcards_data": [
    {
      "question": "What is a Salesforce Profile?",
      "answer": "A profile defines a user's permissions, what they can do with records, and what data they can see.",
      "tags": ["Admin", "Security"]
    },
    {
      "question": "How do you create a new user in Salesforce?",
      "answer": "Navigate to Setup > Users > Users, then click 'New User' and fill in the required details.",
      "tags": ["Admin", "User Management"]
    }
    // ... more flashcards
  ],
  "created_at": "2025-07-27T10:10:00Z",
  "cost_in_tokens": 800,
  "ai_model_used": "deepseek-reasoner"
}
```

## 8. Frontend Changes and New Components

To integrate these new AI features, the existing Next.js frontend will require modifications and the addition of new components.

### 8.1. `src/app/page.tsx` (Main Page)

-   **Modification**: The main page will need to include new sections or links to the AI-powered features.
-   **Example**: Add a new section below `AIFeaturesSection` or integrate these features directly into the existing sections.

### 8.2. New Components

#### 8.2.1. `src/components/AIGeneratePathForm.tsx`

-   **Purpose**: A form component allowing users to input their learning goals and preferences to generate a personalized learning path.
-   **Functionality**: 
    -   Text input for user prompt.
    -   Loading state while AI processes the request.
    -   Display of the generated learning path (e.g., list of modules with links).
    -   Error handling for API calls.
-   **Integration**: Will call `POST /api/ai/generate-learning-path`.

#### 8.2.2. `src/components/AISummarizer.tsx`

-   **Purpose**: A component for users to input text or a URL and receive an AI-generated summary.
-   **Functionality**: 
    -   Input field for URL or text area for direct content.
    -   Option to select summary length (short, medium, long).
    -   Display of the summarized text.
    -   Error handling.
-   **Integration**: Will call `POST /api/ai/summarize`.

#### 8.2.3. `src/components/AIFlashcardGenerator.tsx`

-   **Purpose**: A component to generate and display flashcards based on user input or selected topics.
-   **Functionality**: 
    -   Input for topic or content URL.
    -   Option to specify the number of flashcards.
    -   Display of generated flashcards (e.g., interactive flip cards).
    -   Error handling.
-   **Integration**: Will call `POST /api/ai/generate-flashcards`.

### 8.3. UI/UX Considerations

-   **Loading States**: Implement clear loading indicators for AI operations, as they can take a few seconds.
-   **User Feedback**: Provide informative messages for success, errors, and progress.
-   **Responsive Design**: Ensure new components are fully responsive and integrate seamlessly with the existing Tailwind CSS layout.
-   **Accessibility**: Maintain accessibility standards for all new interactive elements.

## 9. Developer Guide for AI Enhancements

This section provides clear, step-by-step instructions for developers to implement the AI enhancements in the existing GitHub project.

### 9.1. Step 1: Update Supabase Schema

First, you need to add the new tables to your Supabase project. Connect to your Supabase project and run the following SQL commands in the SQL Editor:

```sql
-- Table: public.raw_content
CREATE TABLE public.raw_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url text UNIQUE,
    content_type text NOT NULL,
    raw_text text NOT NULL,
    fetched_at timestamp with time zone DEFAULT now()
);

-- Table: public.processed_content
CREATE TABLE public.processed_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_content_id uuid REFERENCES public.raw_content(id),
    chunk_text text NOT NULL,
    embedding vector(1536), -- Adjust dimension based on your embedding model
    processed_at timestamp with time zone DEFAULT now()
);

-- Table: public.ai_generated_learning_paths
CREATE TABLE public.ai_generated_learning_paths (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id),
    request_prompt text NOT NULL,
    generated_content jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer,
    ai_model_used text
);

-- Table: public.ai_generated_summaries
CREATE TABLE public.ai_generated_summaries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_content_id uuid REFERENCES public.raw_content(id),
    summary_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer,
    ai_model_used text
);

-- Table: public.ai_generated_flashcards
CREATE TABLE public.ai_generated_flashcards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic text,
    source_content_id uuid REFERENCES public.raw_content(id),
    flashcards_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer,
    ai_model_used text
);
```

### 9.2. Step 2: Install AI API Client Libraries

Install the necessary client libraries for the AI APIs you choose to use (e.g., DeepSeek AI, OpenAI, Anthropic). For DeepSeek AI, you might use a generic HTTP client like `axios` or `node-fetch` if a dedicated SDK is not available, or the `openai` package if using OpenAI.

```bash
npm install axios # or npm install openai
```

### 9.3. Step 3: Configure AI API Environment Variables

Add your AI API keys and any other necessary configurations to your `.env.local` file:

```env
# DeepSeek AI
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_BASE_URL=https://api.deepseek.com/v1

# OpenAI (if used)
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE_URL=https://api.openai.com/v1
```

### 9.4. Step 4: Implement AI Service Functions

Create a new directory `src/lib/ai/` and add files for AI service functions. These functions will encapsulate the logic for interacting with the AI APIs.

#### `src/lib/ai/deepseek.ts` (Example for DeepSeek AI)

```typescript
import axios from 'axios';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_BASE_URL = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1';

interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  choices: { message: ChatCompletionMessage; }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number; };
}

export async function getDeepSeekChatCompletion(
  messages: ChatCompletionMessage[],
  model: string = 'deepseek-chat',
  max_tokens: number = 4000
): Promise<ChatCompletionResponse> {
  try {
    const response = await axios.post<ChatCompletionResponse>(
      `${DEEPSEEK_API_BASE_URL}/chat/completions`,
      {
        model: model,
        messages: messages,
        max_tokens: max_tokens,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw new Error('Failed to get DeepSeek chat completion');
  }
}

export async function summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<{ summary: string; tokens: number }> {
  const prompt = `Summarize the following text. The summary should be ${length}.\n\nText: ${text}\n\nSummary:`;
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
    { role: 'user', content: prompt }
  ];

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-chat');
  return { summary: response.choices[0].message.content, tokens: response.usage.total_tokens };
}

export async function generateFlashcards(content: string, topic: string, numCards: number): Promise<{ flashcards: { question: string; answer: string; tags: string[] }[]; tokens: number }> {
  const prompt = `Generate ${numCards} flashcards (question and answer pairs) based on the following content, focusing on key concepts for '${topic}'. Provide relevant tags for each flashcard.\n\nContent: ${content}\n\nFormat the output as a JSON array of objects, where each object has 'question', 'answer', and 'tags' (an array of strings).`;
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: 'You are a helpful assistant that generates flashcards in JSON format.' },
    { role: 'user', content: prompt }
  ];

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-reasoner', 8000); // Use reasoner for larger output
  try {
    const flashcards = JSON.parse(response.choices[0].message.content);
    return { flashcards, tokens: response.usage.total_tokens };
  } catch (e) {
    console.error('Failed to parse flashcards JSON:', response.choices[0].message.content);
    throw new Error('Failed to generate flashcards in expected format.');
  }
}

export async function generateLearningPath(userPrompt: string, existingKnowledge: string = ''): Promise<{ path: any; tokens: number }> {
  const prompt = `Generate a personalized learning path for a Salesforce professional based on the following user request: "${userPrompt}". Consider their existing knowledge: "${existingKnowledge}". The path should include relevant modules, Trailhead links, estimated times, and key skills. Focus on official Salesforce resources (Trailhead, Developer Docs, Salesforce+ concepts). Provide the output as a JSON object with a 'title', 'description', and an array of 'modules', where each module has 'title', 'trailhead_link', 'estimated_time'.`;
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: 'You are a Salesforce learning path generator AI.' },
    { role: 'user', content: prompt }
  ];

  const response = await getDeepSeekChatCompletion(messages, 'deepseek-reasoner', 8000);
  try {
    const path = JSON.parse(response.choices[0].message.content);
    return { path, tokens: response.usage.total_tokens };
  } catch (e) {
    console.error('Failed to parse learning path JSON:', response.choices[0].message.content);
    throw new Error('Failed to generate learning path in expected format.');
  }
}
```

### 9.5. Step 5: Create New API Routes

Create new API routes in `src/app/api/ai/` to expose the AI functionalities to the frontend.

#### `src/app/api/ai/generate-learning-path/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateLearningPath } from '@/lib/ai/deepseek'; // Adjust import based on your AI service
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { user_id, prompt, existing_knowledge } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const { path, tokens } = await generateLearningPath(prompt, existing_knowledge);

    // Save to Supabase
    const { data, error } = await supabase.from('ai_generated_learning_paths').insert({
      user_id: user_id || null, // Associate with user if logged in
      request_prompt: prompt,
      generated_content: path,
      cost_in_tokens: tokens,
      ai_model_used: 'deepseek-reasoner',
    }).select();

    if (error) {
      console.error('Error saving generated path to Supabase:', error);
      // Continue even if saving to DB fails, but log the error
    }

    return NextResponse.json(path);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 });
  }
}
```

#### `src/app/api/ai/summarize/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { summarizeText } from '@/lib/ai/deepseek'; // Adjust import based on your AI service
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { content_url, text_content, summary_length } = await req.json();

    let contentToSummarize = text_content;
    let originalContentId: string | null = null;

    if (content_url) {
      // In a real application, you would fetch content from the URL here.
      // For now, we'll just use a placeholder or expect text_content.
      // You'd also save the raw content to the `raw_content` table.
      // Example: const fetchedContent = await fetch(content_url).then(res => res.text());
      // contentToSummarize = fetchedContent;

      // Mock saving to raw_content for demonstration
      const { data: rawData, error: rawError } = await supabase.from('raw_content').upsert({
        source_url: content_url,
        content_type: 'web_page',
        raw_text: text_content || 'Content fetched from URL placeholder',
      }).select();

      if (rawError) {
        console.error('Error saving raw content:', rawError);
      } else {
        originalContentId = rawData[0].id;
      }
    }

    if (!contentToSummarize) {
      return NextResponse.json({ error: 'No content provided for summarization' }, { status: 400 });
    }

    const { summary, tokens } = await summarizeText(contentToSummarize, summary_length);

    // Save to Supabase
    const { data, error } = await supabase.from('ai_generated_summaries').insert({
      original_content_id: originalContentId,
      summary_text: summary,
      cost_in_tokens: tokens,
      ai_model_used: 'deepseek-chat',
    }).select();

    if (error) {
      console.error('Error saving summary to Supabase:', error);
    }

    return NextResponse.json({ summary_text: summary });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
```

#### `src/app/api/ai/generate-flashcards/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/lib/ai/deepseek'; // Adjust import based on your AI service
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { content_url, text_content, topic, num_flashcards } = await req.json();

    let contentForFlashcards = text_content;
    let sourceContentId: string | null = null;

    if (content_url) {
      // In a real application, you would fetch content from the URL here.
      // For now, we'll just use a placeholder or expect text_content.
      const { data: rawData, error: rawError } = await supabase.from('raw_content').upsert({
        source_url: content_url,
        content_type: 'web_page',
        raw_text: text_content || 'Content fetched from URL placeholder',
      }).select();

      if (rawError) {
        console.error('Error saving raw content for flashcards:', rawError);
      } else {
        sourceContentId = rawData[0].id;
      }
    }

    if (!contentForFlashcards) {
      return NextResponse.json({ error: 'No content provided for flashcard generation' }, { status: 400 });
    }

    const { flashcards, tokens } = await generateFlashcards(contentForFlashcards, topic, num_flashcards);

    // Save to Supabase
    const { data, error } = await supabase.from('ai_generated_flashcards').insert({
      topic: topic,
      source_content_id: sourceContentId,
      flashcards_data: flashcards,
      cost_in_tokens: tokens,
      ai_model_used: 'deepseek-reasoner',
    }).select();

    if (error) {
      console.error('Error saving flashcards to Supabase:', error);
    }

    return NextResponse.json({ flashcards_data: flashcards });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
```

### 9.6. Step 6: Update Frontend Components

Integrate the new AI features into your Next.js frontend. You will need to create new components and update existing ones.

#### 9.6.1. Update `src/app/page.tsx`

Add the new AI components to your main page. You might want to create new sections or modals to house these features.

```typescript
// src/app/page.tsx
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LearningPathsSection from '@/components/LearningPathsSection';
import AIFeaturesSection from '@/components/AIFeaturesSection';
// Import new AI components
import AIGeneratePathForm from '@/components/AIGeneratePathForm';
import AISummarizer from '@/components/AISummarizer';
import AIFlashcardGenerator from '@/components/AIFlashcardGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <LearningPathsSection />
      <AIFeaturesSection />

      {/* New AI Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">AI-Powered Tools for Your Learning Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AIGeneratePathForm />
            <AISummarizer />
            <AIFlashcardGenerator />
          </div>
        </div>
      </section>
    </main>
  );
}
```

#### 9.6.2. Create `src/components/AIGeneratePathForm.tsx`

```typescript
// src/components/AIGeneratePathForm.tsx
'use client';

import { useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';

export default function AIGeneratePathForm() {
  const [prompt, setPrompt] = useState('');
  const [existingKnowledge, setExistingKnowledge] = useState('');
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLearningPath(null);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, existing_knowledge: existingKnowledge }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate learning path');
      }

      const data = await response.json();
      setLearningPath(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-lg mr-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Generate Personalized Learning Path</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Your Learning Goal:</label>
          <textarea
            id="prompt"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., I want to become a certified Salesforce Administrator."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="knowledge" className="block text-sm font-medium text-gray-700">Existing Knowledge (Optional):</label>
          <textarea
            id="knowledge"
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., I have 1 year of experience with Sales Cloud."
            value={existingKnowledge}
            onChange={(e) => setExistingKnowledge(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Generate Path
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">Error: {error}</p>}

      {learningPath && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h4 className="text-lg font-bold text-blue-800 mb-2">{learningPath.title}</h4>
          <p className="text-blue-700 text-sm mb-4">{learningPath.description}</p>
          <h5 className="font-semibold text-blue-800 mb-2">Modules:</h5>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            {learningPath.modules.map((mod: any, index: number) => (
              <li key={index}>
                <a href={mod.trailhead_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {mod.title} ({mod.estimated_time})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

#### 9.6.3. Create `src/components/AISummarizer.tsx`

```typescript
// src/components/AISummarizer.tsx
'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

export default function AISummarizer() {
  const [content, setContent] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary(null);
    setError(null);

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: content, summary_length: summaryLength }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary_text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-3 rounded-lg mr-4">
          <FileText className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Content Summarizer</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Text to Summarize:</label>
          <textarea
            id="content"
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Paste your article, blog post, or document content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="summaryLength" className="block text-sm font-medium text-gray-700">Summary Length:</label>
          <select
            id="summaryLength"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value as 'short' | 'medium' | 'long')}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Summarize
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">Error: {error}</p>}

      {summary && (
        <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
          <h4 className="text-lg font-bold text-green-800 mb-2">Summary:</h4>
          <p className="text-green-700 text-sm">{summary}</p>
        </div>
      )}
    </div>
  );
}
```

#### 9.6.4. Create `src/components/AIFlashcardGenerator.tsx`

```typescript
// src/components/AIFlashcardGenerator.tsx
'use client';

import { useState } from 'react';
import { Zap, Loader2, RotateCcw } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
  tags: string[];
}

export default function AIFlashcardGenerator() {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(5);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFlashcards([]);
    setError(null);
    setCurrentCardIndex(0);
    setShowAnswer(false);

    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: content, topic, num_flashcards: numCards }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.flashcards_data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 p-3 rounded-lg mr-4">
          <Zap className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Flashcard Generator</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content for Flashcards:</label>
          <textarea
            id="content"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Paste text, or mention a topic like 'Salesforce Admin Certification Guide'."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic (e.g., 'Apex Basics'):</label>
          <input
            type="text"
            id="topic"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="e.g., Salesforce Security Model"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="numCards" className="block text-sm font-medium text-gray-700">Number of Flashcards:</label>
          <input
            type="number"
            id="numCards"
            min="1"
            max="20"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            value={numCards}
            onChange={(e) => setNumCards(parseInt(e.target.value))}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Generate Flashcards
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">Error: {error}</p>}

      {flashcards.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-md border border-purple-200">
          <h4 className="text-lg font-bold text-purple-800 mb-4">Your Flashcards ({currentCardIndex + 1}/{flashcards.length})</h4>
          <div 
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer min-h-[150px] flex flex-col justify-between"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <p className="text-gray-800 font-semibold text-center text-lg mb-4">
              {showAnswer ? flashcards[currentCardIndex].answer : flashcards[currentCardIndex].question}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {flashcards[currentCardIndex].tags.map((tag, idx) => (
                <span key={idx} className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevCard}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextCard}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 9.7. Step 7: Data Ingestion Strategy (Conceptual)

For a fully automated system, you would need a mechanism to ingest content from Salesforce Trailhead, Developer Docs, and Salesforce+.

-   **Web Scraping**: For Trailhead modules and developer blogs, you would implement web scraping scripts (e.g., using Node.js with Puppeteer or Python with Beautiful Soup) to extract raw text content.
-   **Salesforce+ Video Transcription**: For Salesforce+ videos, you would need to:
    1.  Obtain video URLs.
    2.  Use a video-to-text transcription service (e.g., Google Cloud Speech-to-Text, OpenAI Whisper API, or a dedicated transcription service) to get the audio transcripts.
-   **Content Storage**: Save the extracted raw text into the `raw_content` table in Supabase.
-   **Processing and Embedding**: Implement a background job (e.g., a cron job, a Supabase Edge Function, or a separate Node.js service) that:
    1.  Reads new entries from `raw_content`.
    2.  Chunks the content into smaller pieces.
    3.  Generates vector embeddings for each chunk using an embedding model (e.g., DeepSeek Embeddings, OpenAI Embeddings).
    4.  Stores the chunks and their embeddings in the `processed_content` table. This table will be crucial for intelligent search and RAG (Retrieval Augmented Generation) for the AI models.

### 9.8. Step 8: Implement Intelligent Search (Conceptual)

With the `processed_content` table containing embeddings, you can implement semantic search:

-   **Vector Search**: When a user performs a search, convert their query into a vector embedding. Then, use Supabase pgvector extension to find the most semantically similar content chunks from the `processed_content` table.
-   **RAG (Retrieval Augmented Generation)**: Pass the retrieved relevant content chunks along with the user's query to the AI model (e.g., DeepSeek AI) to generate more accurate and context-aware responses for learning paths, summaries, and flashcards.

## 10. Conclusion

This architectural design and developer guide provide a robust roadmap for enhancing the SalesforceLearnHub with powerful AI capabilities. By following these steps, developers can integrate DeepSeek AI (or other chosen AI models) to deliver dynamic learning paths, intelligent content summaries, and personalized flashcards, significantly enriching the user experience. The modular design ensures maintainability and scalability for future enhancements. Remember to continuously monitor AI API usage and costs to ensure optimal performance and cost-effectiveness. 

