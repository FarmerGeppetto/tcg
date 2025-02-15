"use client"

import { Slider } from "@/components/ui/slider"
import { useCardStore } from "@/lib/store"

export function StatControls() {
  const card = useCardStore((state) => state.card)
  const updateStats = useCardStore((state) => state.updateStats)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Stats</h2>
      <div className="space-y-6">
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Attack</label>
          <Slider
            defaultValue={[card?.stats.attack || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-red-500"
            onValueChange={([value]) => updateStats({ attack: value })}
          />
        </div>
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Defense</label>
          <Slider
            defaultValue={[card?.stats.defense || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-blue-500"
            onValueChange={([value]) => updateStats({ defense: value })}
          />
        </div>
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-400">Special</label>
          <Slider
            defaultValue={[card?.stats.special || 50]}
            max={100}
            step={1}
            className="[&>span]:bg-purple-500"
            onValueChange={([value]) => updateStats({ special: value })}
          />
        </div>
      </div>
    </div>
  )
}
