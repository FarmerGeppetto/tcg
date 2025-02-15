"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useCardStore } from "@/lib/store"
import { fetchNFTsByOwner, fetchNFTData } from "@/lib/utils"

function BattleContent() {
  const searchParams = useSearchParams()
  const setOpponentWallet = useCardStore((state) => state.setOpponentWallet)
  const setOpponentCard = useCardStore((state) => state.setOpponentCard)
  const playerWallet = useCardStore((state) => state.playerWallet)
  const challenger = searchParams.get('challenger')
  const battleId = searchParams.get('battleId')

  useEffect(() => {
    async function setupBattle() {
      if (challenger && playerWallet) {
        // If current player is not the challenger, they are the opponent
        if (playerWallet.toLowerCase() !== challenger.toLowerCase()) {
          // Set challenger as opponent
          setOpponentWallet(challenger)
          
          // Fetch challenger's NFTs and set as opponent card
          const nfts = await fetchNFTsByOwner(challenger)
          if (nfts.length > 0) {
            const nftData = await fetchNFTData(nfts[0].id, nfts[0].collection)
            setOpponentCard(nftData)
          }
        }
      }
    }

    setupBattle()
  }, [challenger, playerWallet, setOpponentWallet, setOpponentCard])

  // Redirect to home page
  useEffect(() => {
    window.location.href = '/'
  }, [])

  return null
}

export default function BattlePage() {
  return (
    <Suspense fallback={null}>
      <BattleContent />
    </Suspense>
  )
} 