import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet_address = searchParams.get('wallet_address')

  if (!wallet_address) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
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