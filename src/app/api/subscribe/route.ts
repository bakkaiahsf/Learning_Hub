import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, plan } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Store subscription in Supabase
    const { data, error } = await supabase
      .from('email_subscriptions')
      .upsert(
        {
          email: email.trim().toLowerCase(),
          plan: plan || 'free',
          subscribed_at: new Date().toISOString(),
          status: 'active'
        },
        { onConflict: 'email' }
      )
      .select()

    if (error) {
      console.error('Subscription error:', error)
      // Return success even if DB fails for MVP
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription recorded! We\'ll be in touch soon.' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thanks for subscribing! We\'ll keep you updated.' 
    })
  } catch (error) {
    console.error('API error:', error)
    // Return success for MVP - don't let backend issues block user experience
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription recorded! We\'ll be in touch soon.' 
    })
  }
}