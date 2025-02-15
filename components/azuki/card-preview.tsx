"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useCardStore } from "@/lib/store"
import Image from "next/image"
import { AzukiCard } from "@/lib/types"

export function CardPreview() {
  const playerCard = useCardStore((state) => state.playerCard)
  const opponentCard = useCardStore((state) => state.opponentCard)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
      <NFTCard card={playerCard} />
      <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-br from-red-500 to-purple-600 bg-clip-text text-transparent">VS</div>
      <NFTCard card={opponentCard} isOpponent />
    </div>
  )
}

function NFTCard({ card, isOpponent = false }: { card: AzukiCard | null, isOpponent?: boolean }) {
  return (
    <Card className={`w-[300px] h-[380px] bg-gradient-to-br from-indigo-950 to-purple-900 relative group ${isOpponent ? 'opacity-90' : ''}`}>
      <CardContent className="p-4 relative">
        <div className="absolute top-4 right-4 text-sm text-white/60">
          #{card?.id}
        </div>
        
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-full h-[260px] rounded-lg overflow-hidden">
              {card?.image ? (
                <Image 
                  src={card.image}
                  alt={`Azuki #${card.id}`}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="text-white/40">{isOpponent ? 'Opponent Card' : 'Generate a card'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
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
