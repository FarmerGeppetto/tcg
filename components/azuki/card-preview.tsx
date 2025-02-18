"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useCardStore } from "@/lib/store"
import Image from "next/image"
import { AzukiCard } from "@/lib/types"
import { useState, useEffect } from "react"

export function CardPreview() {
  const playerCard = useCardStore((state) => state.playerCard)
  const opponentCard = useCardStore((state) => state.opponentCard)
  const isPlayerTurn = useCardStore((state) => state.isPlayerTurn)
  const [playerAction, setPlayerAction] = useState<string | null>(null)
  const [opponentAction, setOpponentAction] = useState<string | null>(null)

  // Subscribe to battle actions
  useEffect(() => {
    const unsubscribe = useCardStore.subscribe((state, prevState) => {
      // Check if a new action was added to the battle log
      if (state.battleLog[0] !== prevState.battleLog[0]) {
        const action = state.battleLog[0]?.toLowerCase() || ''
        
        if (action.includes('attack')) {
          isPlayerTurn ? setOpponentAction('attack') : setPlayerAction('attack')
        } else if (action.includes('special')) {
          isPlayerTurn ? setOpponentAction('special') : setPlayerAction('special')
        } else if (action.includes('defend')) {
          isPlayerTurn ? setOpponentAction('defend') : setPlayerAction('defend')
        } else if (action.includes('heal')) {
          isPlayerTurn ? setOpponentAction('heal') : setPlayerAction('heal')
        }

        // Clear the effect after animation
        setTimeout(() => {
          setPlayerAction(null)
          setOpponentAction(null)
        }, 1000)
      }
    })

    return () => unsubscribe()
  }, [isPlayerTurn])

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
      <NFTCard card={playerCard} activeAction={playerAction} />
      <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-br from-red-500 to-purple-600 bg-clip-text text-transparent">VS</div>
      <NFTCard card={opponentCard} isOpponent activeAction={opponentAction} />
    </div>
  )
}

function NFTCard({ 
  card, 
  isOpponent = false, 
  activeAction 
}: { 
  card: AzukiCard | null, 
  isOpponent?: boolean,
  activeAction: string | null 
}) {
  // Action-specific gradient styles
  const actionGradients = {
    attack: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-red-600/40 after:to-orange-500/40 after:animate-pulse after:rounded-lg",
    special: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-purple-600/40 after:to-pink-500/40 after:animate-pulse after:rounded-lg",
    defend: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-500/40 after:to-cyan-400/40 after:animate-pulse after:rounded-lg",
    heal: "after:absolute after:inset-0 after:bg-gradient-to-r after:from-green-500/40 after:to-emerald-400/40 after:animate-pulse after:rounded-lg"
  }

  // Action-specific border glow
  const actionGlows = {
    attack: "ring-4 ring-red-600/50",
    special: "ring-4 ring-fuchsia-500/50",
    defend: "ring-4 ring-blue-500/50",
    heal: "ring-4 ring-green-500/50"
  }

  return (
    <Card className={`
      w-[300px] h-[420px] bg-gradient-to-br from-indigo-950 to-purple-900 
      relative group transition-all duration-300
      ${isOpponent ? 'opacity-90' : ''} 
      ${activeAction ? actionGradients[activeAction as keyof typeof actionGradients] : ''}
      ${activeAction ? actionGlows[activeAction as keyof typeof actionGlows] : ''}
    `}>
      <CardContent className="p-4 relative">
        <div className="absolute top-4 right-4 text-sm text-white/60">
          #{card?.id}
        </div>
        
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-full h-[260px] rounded-lg overflow-hidden relative">
              {card?.image ? (
                <>
                  <Image 
                    src={card.image}
                    alt={`Azuki #${card.id}`}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover"
                    priority
                  />
                  {/* Action effect overlay */}
                  {activeAction && (
                    <div className={`
                      absolute inset-0 mix-blend-overlay transition-opacity duration-300
                      ${activeAction === 'attack' && 'bg-gradient-to-t from-red-600/60 via-yellow-500/40 to-transparent'}
                      ${activeAction === 'special' && 'bg-gradient-to-t from-fuchsia-600/60 via-blue-400/40 to-transparent'}
                      ${activeAction === 'defend' && 'bg-gradient-to-t from-blue-500/60 via-cyan-400/40 to-transparent'}
                      ${activeAction === 'heal' && 'bg-gradient-to-t from-green-500/60 via-emerald-400/40 to-transparent'}
                    `} />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="text-white/40">{isOpponent ? 'Opponent Card' : 'Generate a card'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-3 gap-4 bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center">
                <div className="text-red-400 text-base font-medium">ATK</div>
                <div className="text-white text-xl font-bold">{card?.stats.attack || 50}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 text-base font-medium">DEF</div>
                <div className="text-white text-xl font-bold">{card?.stats.defense || 50}</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 text-base font-medium">SP</div>
                <div className="text-white text-xl font-bold">{card?.stats.special || 50}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
