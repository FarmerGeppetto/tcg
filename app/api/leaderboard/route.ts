import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('points', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json([], { status: 500 })
  }
} 