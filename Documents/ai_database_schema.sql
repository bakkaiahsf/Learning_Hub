-- AI Enhanced SalesforceLearnHub Database Schema
-- This schema extends the existing database with AI-powered features

-- Table for storing raw content from various Salesforce sources
CREATE TABLE IF NOT EXISTS public.raw_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url text UNIQUE,
    content_type text NOT NULL CHECK (content_type IN ('trailhead_module', 'developer_blog', 'developer_docs', 'certification_guide', 'salesforce_plus_video')),
    title text,
    raw_text text NOT NULL,
    metadata jsonb DEFAULT '{}',
    fetched_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Table for processed content chunks with embeddings for semantic search
CREATE TABLE IF NOT EXISTS public.processed_content (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_content_id uuid REFERENCES public.raw_content(id) ON DELETE CASCADE,
    chunk_text text NOT NULL,
    chunk_index integer DEFAULT 0,
    embedding vector(1536), -- For OpenAI embeddings, adjust based on chosen embedding model
    processed_at timestamp with time zone DEFAULT now()
);

-- Table for AI-generated learning paths
CREATE TABLE IF NOT EXISTS public.ai_generated_learning_paths (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid, -- Can be null for anonymous users
    request_prompt text NOT NULL,
    existing_knowledge text,
    generated_content jsonb NOT NULL,
    difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_duration text,
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer DEFAULT 0,
    ai_model_used text DEFAULT 'deepseek-reasoner',
    status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft'))
);

-- Table for AI-generated content summaries
CREATE TABLE IF NOT EXISTS public.ai_generated_summaries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_content_id uuid REFERENCES public.raw_content(id) ON DELETE CASCADE,
    summary_text text NOT NULL,
    summary_type text DEFAULT 'medium' CHECK (summary_type IN ('short', 'medium', 'long', 'bullet_points')),
    key_concepts jsonb DEFAULT '[]',
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer DEFAULT 0,
    ai_model_used text DEFAULT 'deepseek-chat'
);

-- Table for AI-generated flashcards
CREATE TABLE IF NOT EXISTS public.ai_generated_flashcards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic text NOT NULL,
    source_content_id uuid REFERENCES public.raw_content(id) ON DELETE SET NULL,
    flashcards_data jsonb NOT NULL, -- Array of {question, answer, tags, difficulty}
    certification_focus text, -- e.g., 'Admin', 'Platform Developer I', 'Marketing Cloud'
    num_cards integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer DEFAULT 0,
    ai_model_used text DEFAULT 'deepseek-reasoner'
);

-- Table for tracking AI usage and costs
CREATE TABLE IF NOT EXISTS public.ai_usage_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_type text NOT NULL CHECK (operation_type IN ('learning_path', 'summary', 'flashcards', 'search', 'content_fetch')),
    ai_model_used text NOT NULL,
    tokens_consumed integer DEFAULT 0,
    cost_estimate decimal(10,4) DEFAULT 0.0000,
    execution_time_ms integer,
    success boolean DEFAULT true,
    error_message text,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

-- Table for intelligent search queries and results
CREATE TABLE IF NOT EXISTS public.ai_search_queries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    query_text text NOT NULL,
    search_type text DEFAULT 'semantic' CHECK (search_type IN ('keyword', 'semantic', 'hybrid')),
    results_found integer DEFAULT 0,
    top_results jsonb DEFAULT '[]', -- Array of relevant content IDs and scores
    ai_enhanced_response text, -- AI-generated contextual response
    created_at timestamp with time zone DEFAULT now(),
    cost_in_tokens integer DEFAULT 0
);

-- Table for content recommendations based on user behavior
CREATE TABLE IF NOT EXISTS public.ai_content_recommendations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    recommended_content_id uuid REFERENCES public.raw_content(id),
    recommendation_type text CHECK (recommendation_type IN ('next_in_path', 'related_topic', 'difficulty_progression', 'certification_prep')),
    confidence_score decimal(3,2) DEFAULT 0.50,
    reasoning text,
    created_at timestamp with time zone DEFAULT now(),
    clicked boolean DEFAULT false,
    clicked_at timestamp with time zone
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_raw_content_type ON public.raw_content(content_type);
CREATE INDEX IF NOT EXISTS idx_raw_content_fetched_at ON public.raw_content(fetched_at);
CREATE INDEX IF NOT EXISTS idx_processed_content_raw_id ON public.processed_content(raw_content_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_paths_user ON public.ai_generated_learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_paths_created ON public.ai_generated_learning_paths(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_content ON public.ai_generated_summaries(original_content_id);
CREATE INDEX IF NOT EXISTS idx_ai_flashcards_topic ON public.ai_generated_flashcards(topic);
CREATE INDEX IF NOT EXISTS idx_ai_usage_type ON public.ai_usage_analytics(operation_type);
CREATE INDEX IF NOT EXISTS idx_ai_search_user ON public.ai_search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.ai_content_recommendations(user_id);

-- Enable Row Level Security (RLS) for user privacy
ALTER TABLE public.ai_generated_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples - adjust based on your auth system)
CREATE POLICY "Users can view their own learning paths" ON public.ai_generated_learning_paths
    FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can create learning paths" ON public.ai_generated_learning_paths
    FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Functions for AI operations
CREATE OR REPLACE FUNCTION public.calculate_content_similarity(
    content1_id uuid,
    content2_id uuid
) RETURNS decimal AS $$
DECLARE
    similarity_score decimal;
BEGIN
    -- This would use vector similarity when embeddings are available
    -- For now, return a placeholder
    RETURN 0.5;
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended content based on user's learning path
CREATE OR REPLACE FUNCTION public.get_ai_content_recommendations(
    user_uuid uuid,
    limit_count integer DEFAULT 5
) RETURNS TABLE (
    content_id uuid,
    title text,
    content_type text,
    recommendation_reason text,
    confidence_score decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rc.id,
        rc.title,
        rc.content_type,
        rec.reasoning,
        rec.confidence_score
    FROM public.ai_content_recommendations rec
    JOIN public.raw_content rc ON rec.recommended_content_id = rc.id
    WHERE rec.user_id = user_uuid
    ORDER BY rec.confidence_score DESC, rec.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample Salesforce content sources for immediate testing
INSERT INTO public.raw_content (source_url, content_type, title, raw_text, metadata) VALUES
('https://trailhead.salesforce.com/content/learn/modules/admin_essentials', 'trailhead_module', 'Admin Essentials', 
 'Learn the fundamentals of Salesforce administration including user management, profiles, permission sets, and data security. This module covers key concepts every admin needs to know.',
 '{"difficulty": "Beginner", "estimated_time": "2 hours", "badges": ["Admin Essentials"]}'),

('https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.get_started_introduction', 'developer_docs', 'Lightning Web Components Introduction',
 'Lightning Web Components (LWC) is a modern framework for building components in Salesforce. It uses web standards and modern JavaScript features to create fast, secure, and maintainable components.',
 '{"category": "Development", "difficulty": "Intermediate", "framework": "LWC"}'),

('https://trailhead.salesforce.com/content/learn/modules/apex_fundamentals', 'trailhead_module', 'Apex Fundamentals',
 'Master Apex programming language fundamentals including data types, control flow, exception handling, and best practices for development on the Salesforce platform.',
 '{"difficulty": "Intermediate", "estimated_time": "4 hours", "badges": ["Apex Basics"]}}'),

('https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm', 'developer_docs', 'SOQL and SOSL Reference',
 'Comprehensive guide to Salesforce Object Query Language (SOQL) and Salesforce Object Search Language (SOSL) for querying data in Salesforce orgs.',
 '{"category": "Query Languages", "difficulty": "Intermediate", "type": "Reference"}')

ON CONFLICT (source_url) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE public.raw_content IS 'Stores raw content fetched from Salesforce learning resources';
COMMENT ON TABLE public.processed_content IS 'Stores chunked and embedded content for AI processing and semantic search';
COMMENT ON TABLE public.ai_generated_learning_paths IS 'AI-generated personalized learning paths based on user goals';
COMMENT ON TABLE public.ai_generated_summaries IS 'AI-generated summaries of learning content';
COMMENT ON TABLE public.ai_generated_flashcards IS 'AI-generated flashcards for certification preparation';
COMMENT ON TABLE public.ai_usage_analytics IS 'Tracks AI API usage and costs for monitoring and optimization';