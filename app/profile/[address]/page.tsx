"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'

interface PlayerProfile {
  username: string
  wins: number
  losses: number
  points: number
  rank: number
  created_at: string
  last_battle_at: string
}

interface Battle {
  id: string
  winner_card_id: string
  loser_card_id: string
  battle_date: string
  opponent_username: string
  won: boolean
}

export default function ProfilePage({ params }: { params: { address: string } }) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [battles, setBattles] = useState<Battle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: player } = await supabase
          .from('players')
          .select('*')
          .eq('wallet_address', params.address)
          .single()

        const { data: battleHistory } = await supabase
          .from('battles')
          .select(`
            id,
            winner_card_id,
            loser_card_id,
            battle_date,
            winner:winner_address(username),
            loser:loser_address(username)
          `)
          .or(`winner_address.eq.${params.address},loser_address.eq.${params.address}`)

        setProfile(player)
        // Transform battle data to match Battle type
        const formattedBattles: Battle[] = battleHistory?.map(battle => ({
          id: battle.id,
          winner_card_id: battle.winner_card_id,
          loser_card_id: battle.loser_card_id,
          battle_date: battle.battle_date,
          opponent_username: battle.winner[0]?.username === player?.username 
            ? battle.loser[0]?.username 
            : battle.winner[0]?.username,
          won: battle.winner[0]?.username === player?.username
        })) || []
        
        setBattles(formattedBattles)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.address])

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Player not found</div>

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card className="p-6 backdrop-blur-sm bg-black/40 border-white/10">
        <h1 className="text-2xl font-bold mb-4">{profile.username}&apos;s Profile</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Rank" value={`#${profile.rank}`} />
          <StatCard title="Points" value={profile.points} />
          <StatCard title="Wins" value={profile.wins} />
          <StatCard title="Losses" value={profile.losses} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Battles</h2>
          <div className="space-y-2">
            {battles.map((battle) => (
              <div 
                key={battle.id}
                className="flex justify-between items-center p-4 rounded-lg bg-white/5"
              >
                <div>
                  <span className={battle.won ? "text-green-400" : "text-red-400"}>
                    {battle.won ? "Won" : "Lost"} against {battle.opponent_username}
                  </span>
                </div>
                <div className="text-sm text-white/60">
                  {new Date(battle.battle_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-4 rounded-lg bg-white/5">
      <div className="text-sm text-white/60">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
} 