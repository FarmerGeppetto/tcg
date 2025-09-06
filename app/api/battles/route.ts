import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { winner_address, loser_address, winner_card_id, loser_card_id, points } = body
    
    console.log('Battle recorded:', { winner_address, points }) // Debug log

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not configured, returning mock battle result')
      return NextResponse.json({ success: true, points: points || 100 })
    }

    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Record the battle
    const { error: battleError } = await supabase
      .from('battles')
      .insert({
        winner_address,
        loser_address,
        winner_card_id,
        loser_card_id
      })

    if (battleError) throw battleError

    // Update winner's points and wins
    const { data: winnerData, error: winnerError } = await supabase
      .from('players')
      .select('points, wins')
      .eq('wallet_address', winner_address)
      .single()

    if (winnerError) throw winnerError

    console.log('Current points:', winnerData?.points) // Debug log

    const newPoints = (winnerData?.points || 0) + points
    console.log('New points:', newPoints) // Debug log

    const { data: updateData, error: updateError } = await supabase
      .from('players')
      .update({ 
        points: newPoints,
        wins: (winnerData?.wins || 0) + 1
      })
      .eq('wallet_address', winner_address)
      .select()

    if (updateError) throw updateError

    console.log('Update result:', updateData) // Debug log

    return NextResponse.json({ success: true, points: newPoints })
  } catch (error) {
    console.error('Error recording battle:', error)
    return NextResponse.json({ error: 'Failed to record battle' }, { status: 500 })
  }
} 