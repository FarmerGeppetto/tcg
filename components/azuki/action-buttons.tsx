"use client"

import { useCardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

export function ActionButtons() {
  const performAction = useCardStore((state) => state.performAction)
  const playerCard = useCardStore((state) => state.playerCard)
  const opponentCard = useCardStore((state) => state.opponentCard)
  const playerHealth = useCardStore((state) => state.playerHealth)
  const opponentHealth = useCardStore((state) => state.opponentHealth)

  const canPerformAction = playerCard && opponentCard && playerHealth > 0 && opponentHealth > 0

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      {/* Health Bars */}
      <div className="flex gap-8 items-center text-sm">
        <div className="flex items-center gap-2">
          <span>Player: {playerHealth}%</span>
          <div className="w-32 h-2 bg-black/30 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${playerHealth}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span>Opponent: {opponentHealth}%</span>
          <div className="w-32 h-2 bg-black/30 rounded-full">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${opponentHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 backdrop-blur-md bg-black/30 p-4 rounded-2xl border border-white/10">
        <ActionButton
          icon="⚔️"
          label="Attack"
          onClick={() => canPerformAction && performAction('attack')}
          color="bg-red-500"
          disabled={!canPerformAction}
        />
        <ActionButton
          icon="💫"
          label="Special"
          onClick={() => canPerformAction && performAction('special')}
          color="bg-purple-500"
          disabled={!canPerformAction}
        />
        <ActionButton
          icon="🛡️"
          label="Defend"
          onClick={() => canPerformAction && performAction('defend')}
          color="bg-blue-500"
          disabled={!canPerformAction}
        />
        <ActionButton
          icon="💝"
          label="Heal"
          onClick={() => canPerformAction && performAction('heal')}
          color="bg-green-500"
          disabled={!canPerformAction}
        />
      </div>
    </div>
  )
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  color,
  disabled
}: ActionButtonProps) {
  const actionStates = useCardStore((state) => state.actionStates)
  const actionState = actionStates[label.toLowerCase() as keyof typeof actionStates]
  const isDisabled = actionState.remainingUses <= 0 || disabled

  return (
    <Button
      onClick={onClick}
      className={`${color} hover:opacity-90 h-14 relative group ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {actionState.remainingUses !== Infinity && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-60">
          {actionState.remainingUses} left
        </div>
      )}
      {actionState.cooldown > 0 && actionState.lastUsed && (
        <div className="absolute -top-2 -right-2 bg-black/60 text-xs px-1.5 py-0.5 rounded-full">
          CD: {actionState.cooldown}
        </div>
      )}
    </Button>
  )
} 