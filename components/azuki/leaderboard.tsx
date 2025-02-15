"use client"

import { useEffect, useState } from 'react'
import { useCardStore } from '@/lib/store'

interface Player {
  wallet_address: string
  username: string
  points: number
  wins: number
}

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const playerWallet = useCardStore((state) => state.playerWallet)
  const getPlayerPoints = useCardStore((state) => state.getPlayerPoints)

  const fetchPlayers = async () => {
    try {
      console.log('Fetching leaderboard...'); // Debug log
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        console.log('Leaderboard data:', data); // Debug log
        setPlayers(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPlayers()
    if (playerWallet) {
      getPlayerPoints()
    }
  }, [playerWallet, getPlayerPoints])

  // Refresh when points change
  useEffect(() => {
    fetchPlayers()
  }, [playerWallet])

  if (loading) {
    return (
      <div className="backdrop-blur-sm bg-black/40 p-3 sm:p-4 lg:p-6 rounded-2xl border border-white/10 w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">Top Players</h2>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">BETA</span>
            <span className="text-xs text-white/40">Coming Soon</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-8 text-white/60">
          Loading leaderboard...
        </div>
      </div>
    )
  }

  return (
    <div className="backdrop-blur-sm bg-black/40 p-3 sm:p-4 lg:p-6 rounded-2xl border border-white/10 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">Top Players</h2>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">BETA</span>
          <span className="text-xs text-white/40">Coming Soon</span>
        </div>
      </div>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div 
            key={player.wallet_address}
            className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span className={`
                flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold
                ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                  index === 1 ? 'bg-gray-300/20 text-gray-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-300' :
                  'bg-white/10 text-white/60'}
              `}>
                {index + 1}
              </span>
              <span className="font-medium truncate text-sm sm:text-base">{player.username}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-shrink-0 ml-2 sm:ml-4">
              <span className="text-green-400">{player.wins}W</span>
              <span className="text-purple-400">{player.points}pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 