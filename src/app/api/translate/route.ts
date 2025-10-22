/**
 * Google Translate API Route
 * Handles translation requests securely on the server side
 * This prevents exposing API key to the client
 */

import { NextRequest, NextResponse } from 'next/server'

// Rate limiting (simple in-memory store)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    const { text, targetLang, sourceLang = 'en' } = await request.json()
    
    // Validation
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }
    
    if (!targetLang || typeof targetLang !== 'string') {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      )
    }
    
    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return NextResponse.json({ translatedText: text })
    }
    
    // Get API key from environment
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
    
    if (!apiKey) {
      console.error('GOOGLE_TRANSLATE_API_KEY is not set')
      return NextResponse.json(
        { error: 'Translation service is not configured' },
        { status: 500 }
      )
    }
    
    // Call Google Translate API
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: sourceLang,
        format: 'text',
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Google Translate API error:', errorData)
      
      return NextResponse.json(
        { error: 'Translation failed', details: errorData },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    const translatedText = data.data?.translations?.[0]?.translatedText
    
    if (!translatedText) {
      return NextResponse.json(
        { error: 'Translation failed: No translation returned' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ translatedText })
    
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  
  return NextResponse.json({
    status: 'ok',
    configured: !!apiKey,
    rateLimit: {
      limit: RATE_LIMIT,
      window: `${RATE_LIMIT_WINDOW / 1000 / 60} minutes`
    }
  })
}
