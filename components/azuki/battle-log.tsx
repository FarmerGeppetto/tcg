"use client"

import { useCardStore } from "@/lib/store"

export function BattleLog() {
  const battleLog = useCardStore((state) => state.battleLog)
  const isPlayerTurn = useCardStore((state) => state.isPlayerTurn)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Battle Log</h3>
        <span className="text-sm text-white/60">
          {isPlayerTurn ? 
            <span className="text-blue-400">Player's Turn</span> : 
            <span className="text-red-400">Opponent's Turn</span>
          }
        </span>
      </div>
      <div className="space-y-2 text-sm text-white/80">
        {battleLog.map((log, i) => (
          <div 
            key={i} 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: log }}
          />
        ))}
      </div>
    </div>
  )
} 