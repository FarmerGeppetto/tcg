"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCardStore } from "@/lib/store"
import { fetchNFTsByOwner, fetchNFTData } from "@/lib/utils"

export default function BattlePage() {
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

  useCardStore.getState().setBattleId(battleId)

  // Redirect to home page
  useEffect(() => {
    window.location.href = '/'
  }, [])

  return null
} 