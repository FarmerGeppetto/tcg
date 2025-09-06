import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not configured, returning empty leaderboard')
      return NextResponse.json([])
    }

    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    console.log('Attempting to fetch leaderboard from Supabase...')
    
    const { data, error } = await supabase
      .from('players')
      .select('wallet_address, username, points, wins, losses')
      .order('points', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase query error:', error)
      // If it's a table doesn't exist error, return empty array
      if (error.message.includes('relation "players" does not exist')) {
        console.log('Players table does not exist, returning empty leaderboard')
        return NextResponse.json([])
      }
      throw error
    }

    console.log('Successfully fetched leaderboard data:', data?.length || 0, 'players')
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching leaderboard:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error),
      hint: 'Check if Supabase tables exist and RLS policies are configured',
      code: ''
    })
    return NextResponse.json([])
  }
} 