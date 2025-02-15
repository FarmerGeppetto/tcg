"use client"

import { Slider } from "@/components/ui/slider"
import { useCardStore } from "@/lib/store"

export function StatControls() {
  const playerCard = useCardStore((state) => state.playerCard)
  const setPlayerCard = useCardStore((state) => state.setPlayerCard)

  const updateStats = (update: Partial<{ attack: number; defense: number; special: number }>) => {
    if (!playerCard) return
    setPlayerCard({
      ...playerCard,
      stats: { ...playerCard.stats, ...update }
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Stats</h2>
      <div className="space-y-6">
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Attack</label>
          <Slider
            defaultValue={[playerCard?.stats.attack || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-red-500"
            onValueChange={([value]: number[]) => updateStats({ attack: value })}
          />
        </div>
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Defense</label>
          <Slider
            defaultValue={[playerCard?.stats.defense || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-blue-500"
            onValueChange={([value]: number[]) => updateStats({ defense: value })}
          />
        </div>
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Special</label>
          <Slider
            defaultValue={[playerCard?.stats.special || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-purple-500"
            onValueChange={([value]: number[]) => updateStats({ special: value })}
          />
        </div>
      </div>
    </div>
  )
}
