"use client"

export const dynamic = 'force-dynamic'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardPreview } from "@/components/azuki/card-preview"
import { useCardStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { fetchNFTData, preloadAzukiIds } from "@/lib/utils"
import { ActionButton } from "@/components/azuki/action-buttons"
import { CollectionSelector } from "@/components/azuki/collection-selector"
import { BattleLog } from "@/components/azuki/battle-log"
import { VictoryOverlay } from "@/components/azuki/victory-overlay"
import { Footer } from "@/components/azuki/footer"
import { Leaderboard } from "@/components/azuki/leaderboard"
import { Nav } from "@/components/azuki/nav"

export default function Home() {
  const [playerNftId, setPlayerNftId] = useState("")
  const [opponentNftId, setOpponentNftId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availableIds, setAvailableIds] = useState<string[]>([])
  const [collection, setCollection] = useState<'AZUKI' | 'ELEMENTALS' | 'BEANZ'>('ELEMENTALS')
  const setPlayerCard = useCardStore((state) => state.setPlayerCard)
  const setOpponentCard = useCardStore((state) => state.setOpponentCard)
  const playerHealth = useCardStore((state) => state.playerHealth)
  const opponentHealth = useCardStore((state) => state.opponentHealth)
  const performAction = useCardStore((state) => state.performAction)
  const resetBattle = useCardStore((state) => state.resetBattle)
  const playerEns = useCardStore((state) => state.playerEns)
  const playerWallet = useCardStore((state) => state.playerWallet)
  const opponentWallet = useCardStore((state) => state.opponentWallet)

  // Load available NFT IDs on mount and when collection changes
  useEffect(() => {
    preloadAzukiIds(collection).then(ids => setAvailableIds(ids))
  }, [collection])

  const handleGeneratePlayer = async () => {
    setIsLoading(true)
    try {
      const id = playerNftId || availableIds[Math.floor(Math.random() * availableIds.length)]
      setPlayerNftId(id)
      const nftData = await fetchNFTData(id, collection)
      setPlayerCard(nftData)
    } catch (error) {
      console.error('Failed to generate card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateOpponent = async () => {
    setIsLoading(true)
    try {
      const id = opponentNftId || availableIds[Math.floor(Math.random() * availableIds.length)]
      setOpponentNftId(id)
      const nftData = await fetchNFTData(id, collection)
      setOpponentCard(nftData)
    } catch (error) {
      console.error('Failed to generate opponent card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-zinc-950 text-white relative overflow-x-hidden">
      <Nav />
      <VictoryOverlay />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(0,0,0,0))] z-0" />
      
      <div className="relative z-10 min-h-screen pt-40 pb-16">
        <div className="container mx-auto px-2 h-full flex items-start">
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-[300px_1fr_300px] gap-4 lg:gap-6 -translate-x-20">
            {/* Left Column - Controls */}
            <div className="space-y-6 backdrop-blur-sm bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10">
              <CollectionSelector
                selected={collection}
                onSelect={(col) => {
                  setCollection(col)
                  setPlayerNftId("")
                  setOpponentNftId("")
                  setPlayerCard(null)
                  setOpponentCard(null)
                  resetBattle()
                }}
              />
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">
                  {playerEns ? `${playerEns}` : playerWallet ? `${playerWallet.slice(0, 6)}...${playerWallet.slice(-4)}` : 'Player NFT'}
                </h2>
                <Input 
                  placeholder="Enter NFT ID or generate random" 
                  value={playerNftId}
                  onChange={(e) => setPlayerNftId(e.target.value)}
                />
                <Button onClick={handleGeneratePlayer} disabled={isLoading}>
                  Generate Card
                </Button>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">
                  {opponentWallet ? `${opponentWallet.slice(0, 6)}...${opponentWallet.slice(-4)}` : 'Opponent NFT'}
                </h2>
                <Input 
                  placeholder="Enter NFT ID or generate random" 
                  value={opponentNftId}
                  onChange={(e) => setOpponentNftId(e.target.value)}
                />
                <Button onClick={handleGenerateOpponent} disabled={isLoading}>
                  Generate Card
                </Button>
              </div>

              {/* Add Leaderboard */}
              <Leaderboard />
            </div>

            {/* Center Column - Cards and Battle Log */}
            <div className="flex flex-col gap-6">
              {/* Cards */}
              <div className="flex items-center justify-center">
                <CardPreview />
              </div>

              {/* Battle Log */}
              <div className="backdrop-blur-sm bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10">
                <BattleLog />
              </div>
            </div>

            {/* Right Column - Battle Controls (now without battle log) */}
            <div className="backdrop-blur-sm bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10 space-y-6">
              {/* Health Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Status</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Player</span>
                      <span>{playerHealth}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${playerHealth}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Opponent</span>
                      <span>{opponentHealth}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-300"
                        style={{ width: `${opponentHealth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Battle Actions */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Battle Actions</h2>
                <div className="grid grid-cols-1 gap-4">
                  <ActionButton
                    icon="⚔️"
                    label="Attack"
                    onClick={() => performAction('attack')}
                    color="bg-red-500"
                  />
                  <ActionButton
                    icon="💫"
                    label="Special"
                    onClick={() => performAction('special')}
                    color="bg-purple-500"
                  />
                  <ActionButton
                    icon="🛡️"
                    label="Defend"
                    onClick={() => performAction('defend')}
                    color="bg-blue-500"
                  />
                  <ActionButton
                    icon="💝"
                    label="Heal"
                    onClick={() => performAction('heal')}
                    color="bg-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
