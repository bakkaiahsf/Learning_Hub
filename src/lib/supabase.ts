import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database tables
export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  modules_count: number
  key_skills: string[]
  rating: number
  image_url?: string
}

export interface LearningModule {
  id: string
  path_id: string
  title: string
  content: string
  order: number
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  last_accessed: string
}

export interface SearchQuery {
  id: string
  query_text: string
  count: number
}

