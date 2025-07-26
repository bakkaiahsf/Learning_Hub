import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .order('rating', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      // Return mock data if Supabase is not configured
      return NextResponse.json(mockLearningPaths)
    }

    return NextResponse.json(data || mockLearningPaths)
  } catch (error) {
    console.error('API error:', error)
    // Return mock data as fallback
    return NextResponse.json(mockLearningPaths)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('learning_paths')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mock data for fallback
const mockLearningPaths = [
  {
    id: '1',
    title: 'Salesforce Administrator',
    description: 'Master the fundamentals of Salesforce administration, user management, and platform customization.',
    difficulty: 'Beginner',
    duration: '40-60 hours',
    modules_count: 12,
    key_skills: ['User Management', 'Data Management', 'Security'],
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Platform Developer',
    description: 'Learn Apex programming, Lightning Web Components, and advanced development techniques.',
    difficulty: 'Intermediate',
    duration: '80-120 hours',
    modules_count: 18,
    key_skills: ['Apex', 'Lightning Web Components', 'Visualforce'],
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Sales Cloud Consultant',
    description: 'Implement and configure Sales Cloud solutions for various business requirements.',
    difficulty: 'Intermediate',
    duration: '60-80 hours',
    modules_count: 15,
    key_skills: ['Sales Processes', 'Lead Management', 'Opportunity Management'],
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Technical Architect',
    description: 'Design scalable, secure, and high-performance Salesforce solutions.',
    difficulty: 'Advanced',
    duration: '120-160 hours',
    modules_count: 22,
    key_skills: ['Architecture Design', 'Integration', 'Security'],
    rating: 4.9,
  },
  {
    id: '5',
    title: 'Marketing Cloud Specialist',
    description: 'Create personalized customer journeys and marketing automation workflows.',
    difficulty: 'Intermediate',
    duration: '70-90 hours',
    modules_count: 16,
    key_skills: ['Email Marketing', 'Journey Builder', 'Automation'],
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Salesforce Associate',
    description: 'Start your Salesforce journey with foundational knowledge and core concepts.',
    difficulty: 'Beginner',
    duration: '20-30 hours',
    modules_count: 8,
    key_skills: ['CRM Basics', 'Navigation', 'Data Entry'],
    rating: 4.5,
  },
]

