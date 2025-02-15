"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useCardStore } from "@/lib/store"
import { useEnsName, useEnsAvatar } from 'wagmi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { fetchNFTsByOwner, fetchNFTData } from "@/lib/utils"

export function WalletConnect() {
  const [showDialog, setShowDialog] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [username, setUsername] = useState("")
  const setPlayerWallet = useCardStore((state) => state.setPlayerWallet)
  const setPlayerEns = useCardStore((state) => state.setPlayerEns)
  const setPlayerAvatar = useCardStore((state) => state.setPlayerAvatar)
  const playerWallet = useCardStore((state) => state.playerWallet)
  const playerEns = useCardStore((state) => state.playerEns)
  const playerAvatar = useCardStore((state) => state.playerAvatar)
  const [tempWallet, setTempWallet] = useState<string | null>(null)
  const setPlayerCard = useCardStore((state) => state.setPlayerCard)
  const playerCard = useCardStore((state) => state.playerCard)

  // Check for saved wallet on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('playerWallet')
    const savedUsername = localStorage.getItem('playerUsername')
    if (savedWallet) {
      setPlayerWallet(savedWallet)
      if (savedUsername) {
        setUsername(savedUsername)
      }
    }
  }, [setPlayerWallet])

  // Get ENS data
  const { data: ensName } = useEnsName({
    address: playerWallet as `0x${string}`,
    chainId: 1,
  }) ?? undefined

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: 1,
  })

  // Update ENS data when available
  useEffect(() => {
    if (ensName && typeof ensName === 'string') setPlayerEns(ensName)
    if (ensAvatar && typeof ensAvatar === 'string') setPlayerAvatar(ensAvatar)
  }, [ensName, ensAvatar, setPlayerEns, setPlayerAvatar])

  // Set default username to ENS if available
  useEffect(() => {
    if (ensName && typeof ensName === 'string' && !username) {
      setUsername(ensName)
    }
  }, [ensName, username])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        const address = accounts[0]
        setTempWallet(address)
        
        // Fetch user's NFTs when they connect
        const nfts = await fetchNFTsByOwner(address)
        if (nfts.length > 0) {
          // Set the first NFT as their player card
          const nftData = await fetchNFTData(nfts[0].id, nfts[0].collection)
          setPlayerCard(nftData)
        }
        
        // Check if user already exists
        const response = await fetch(`/api/players?wallet_address=${address}`)
        if (response.ok) {
          const player = await response.json()
          if (player) {
            setPlayerWallet(address)
            setUsername(player.username)
            localStorage.setItem('playerWallet', address)
            localStorage.setItem('playerUsername', player.username)
            return
          }
        }
        
        setShowDialog(true)
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const registerPlayer = async () => {
    if (!tempWallet || !username) return
    
    try {
      console.log('Registering with:', { tempWallet, username }) // Debug log
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          wallet_address: tempWallet,
          username
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Registration response:', data) // Debug log
        setPlayerWallet(tempWallet)
        localStorage.setItem('playerWallet', tempWallet)
        localStorage.setItem('playerUsername', username)
        setShowDialog(false)
      } else {
        console.error('Registration failed:', await response.json())
      }
    } catch (error) {
      console.error('Error registering player:', error)
    }
  }

  const createInviteLink = () => {
    if (!playerCard) {
      toast.error("Please generate your card first!")
      return
    }
    
    const link = `${window.location.origin}/battle?challenger=${playerWallet}`
    setInviteLink(link)
    navigator.clipboard.writeText(link)
    toast.success("Battle invite link copied! Share with your opponent to start the battle.")
  }

  return (
    <div className="flex items-center gap-2">
      {playerWallet && (
        <Button
          onClick={createInviteLink}
          className="bg-gradient-to-br from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="text-xl">⚔️</span>
          <span>Invite to Battle</span>
        </Button>
      )}

      <Button 
        onClick={connectWallet}
        className="relative overflow-hidden group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300" />
        <div className="relative flex items-center gap-2 px-4 py-2">
          {playerWallet ? (
            <>
              {playerAvatar ? (
                <Image 
                  src={playerAvatar}
                  alt="ENS Avatar"
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <Image 
                  src="/metamask.svg" 
                  alt="MetaMask" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5"
                />
              )}
              <span>{playerEns || `${playerWallet.slice(0, 6)}...${playerWallet.slice(-4)}`}</span>
            </>
          ) : (
            <>
              <Image 
                src="/metamask.svg" 
                alt="MetaMask" 
                width={20} 
                height={20} 
                className="w-5 h-5"
              />
              Connect Wallet
            </>
          )}
        </div>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-zinc-950/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Choose Your Username</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {inviteLink && (
              <div className="space-y-2">
                <Input 
                  value={inviteLink}
                  readOnly
                  className="bg-white/5 text-sm"
                  onClick={(e) => {
                    e.currentTarget.select()
                    navigator.clipboard.writeText(inviteLink)
                    toast.success("Link copied!")
                  }}
                />
                <p className="text-xs text-white/60 text-center">
                  Share this link to invite someone to battle!
                </p>
              </div>
            )}
            <Button 
              onClick={registerPlayer}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Start Playing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 