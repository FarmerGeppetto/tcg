import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet_address = searchParams.get('wallet_address')

  if (!wallet_address) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not configured, returning mock player data')
      return NextResponse.json({
        wallet_address,
        username: `${wallet_address.slice(0, 6)}...${wallet_address.slice(-4)}`,
        points: 0,
        wins: 0,
        losses: 0
      })
    }

    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('wallet_address', wallet_address)
      .single()

    if (error) throw error

    console.log('Player data:', data) // Debug log
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { wallet_address, username } = body

    console.log('Registering player:', { wallet_address, username }) // Debug log

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not configured, returning mock registration')
      return NextResponse.json({
        wallet_address,
        username,
        points: 0,
        wins: 0,
        losses: 0
      })
    }

    // Create a fresh Supabase client for this request
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase
      .from('players')
      .insert([
        { 
          wallet_address,
          username,
          points: 0,
          wins: 0
        }
      ])
      .select()
      .single()

    if (error) throw error

    console.log('Player registered:', data) // Debug log
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error registering player:', error)
    return NextResponse.json({ error: 'Failed to register player' }, { status: 500 })
  }
} 