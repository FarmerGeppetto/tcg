"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCardStore } from "@/lib/store"
import { toast } from "sonner"

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  icon: string
  effect: string
  comingSoon?: boolean
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'full-heal',
    name: 'Full Heal Potion',
    description: 'Instantly restore your HP to 100%',
    price: 50,
    icon: '🧪',
    effect: 'heal-full',
    comingSoon: true
  },
  {
    id: 'attack-boost',
    name: 'Attack Boost',
    description: 'Increase attack damage by 20% for one battle',
    price: 75,
    icon: '⚔️',
    effect: 'boost-attack',
    comingSoon: true
  },
  {
    id: 'defense-shield',
    name: 'Defense Shield',
    description: 'Reduce incoming damage by 25% for one battle',
    price: 75,
    icon: '🛡️',
    effect: 'boost-defense',
    comingSoon: true
  },
  {
    id: 'revival-token',
    name: 'Revival Token',
    description: 'Continue battle with 50% HP when defeated',
    price: 100,
    icon: '💫',
    effect: 'revival',
    comingSoon: true
  }
]

export function Shop() {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const playerPoints = useCardStore((state) => state.playerPoints)
  const setPlayerPoints = useCardStore((state) => state.setPlayerPoints)
  const addInventoryItem = useCardStore((state) => state.addInventoryItem)
  const playerWallet = useCardStore((state) => state.playerWallet)

  const purchaseItem = async (item: ShopItem) => {
    if (playerPoints < item.price) {
      toast.error("Not enough points!")
      return
    }

    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${playerWallet}`
        },
        body: JSON.stringify({ 
          itemId: item.id,
          wallet_address: playerWallet
        })
      })

      if (response.ok) {
        setPlayerPoints(playerPoints - item.price)
        addInventoryItem(item)
        toast.success(`Purchased ${item.name}!`)
        setSelectedItem(null)
      }
    } catch (error) {
      toast.error("Failed to purchase item")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => setSelectedItem(null)}
          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-medium px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2"
        >
          <span className="text-xl">🏪</span>
          <span>Shop</span>
          <span className="bg-yellow-400/20 px-2 py-0.5 rounded-lg text-sm">NEW!</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950/90 border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Item Shop</DialogTitle>
          <div className="flex items-center justify-between">
            <p className="text-white/60">Your Points: {playerPoints}</p>
            <div className="animate-pulse">
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-2 py-1">
                <span className="text-xs font-bold text-purple-300">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHOP_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer relative"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-white/60">{item.price} points</p>
                </div>
                {item.comingSoon && (
                  <div className="animate-pulse">
                    <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg px-2 py-1">
                      <span className="text-xs font-bold text-purple-300">
                        COMING SOON
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/80">{item.description}</p>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div className="mt-4 p-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{selectedItem.name}</h4>
                <p className="text-sm text-white/60">Cost: {selectedItem.price} points</p>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  purchaseItem(selectedItem)
                }}
                disabled={playerPoints < selectedItem.price}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Purchase
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 