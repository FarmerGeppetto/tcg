import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { battleId } = await request.json()

  try {
    // Record battle as verified
    await supabase
      .from('battles')
      .update({ 
        verified: true,
      })
      .eq('id', battleId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying battle:', error)
    return NextResponse.json({ error: 'Failed to verify battle' }, { status: 500 })
  }
} 