"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function QuestionMarkIcon() {
  return (
    <svg 
      width="15" 
      height="15" 
      viewBox="0 0 15 15" 
      className="w-4 h-4 mr-2"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.07505 4.10001C5.07505 2.91103 6.25727 1.92502 7.50005 1.92502C8.74283 1.92502 9.92505 2.91103 9.92505 4.10001C9.92505 5.19861 9.36782 5.71436 8.61854 6.37884L8.58757 6.4063C7.84481 7.06467 6.92505 7.87995 6.92505 9.5C6.92505 9.81757 7.18248 10.075 7.50005 10.075C7.81761 10.075 8.07505 9.81757 8.07505 9.5C8.07505 8.41517 8.62945 7.90623 9.38156 7.23925L9.40238 7.22079C10.1496 6.55829 11.075 5.73775 11.075 4.10001C11.075 2.12757 9.21869 0.775024 7.50005 0.775024C5.7814 0.775024 3.92505 2.12757 3.92505 4.10001C3.92505 4.41758 4.18249 4.67501 4.50005 4.67501C4.81761 4.67501 5.07505 4.41758 5.07505 4.10001ZM7.50005 13.3575C7.9833 13.3575 8.37505 12.9657 8.37505 12.4825C8.37505 11.9992 7.9833 11.6075 7.50005 11.6075C7.0168 11.6075 6.62505 11.9992 6.62505 12.4825C6.62505 12.9657 7.0168 13.3575 7.50005 13.3575Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function HowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-500/90 hover:bg-purple-500/70 text-white font-medium px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2"
        >
          <span className="text-xl">🎮</span>
          <span>How to Play</span>
          <span className="w-6 h-6 flex items-center justify-center bg-purple-400/20 rounded-lg">?</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-950/90 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Play AZUKI TCG</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-white/80">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Getting Started</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Connect your wallet to start playing and track your progress</li>
              <li>Your ENS name and avatar will be displayed if available</li>
              <li>Choose your collection: Azuki, Elementals, or BEANZ</li>
              <li>Generate cards for you and your opponent</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Battle System</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Each card has three stats: Attack (⚔️), Defense (🛡️), and Special (💫)</li>
              <li>Players take turns performing actions</li>
              <li>Win by reducing your opponent&apos;s health to 0</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Actions</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="text-red-400">Attack (⚔️)</span> - Deal damage based on your Attack stat</li>
              <li><span className="text-purple-400">Special (💫)</span> - Unleash a powerful special attack</li>
              <li><span className="text-blue-400">Defend (🛡️)</span> - Recover HP based on your Defense stat</li>
              <li><span className="text-green-400">Heal (💝)</span> - Restore 20 HP</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Features</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Earn points for winning battles</li>
              <li>Visit the 🏪 Shop to buy power-ups and items</li>
              <li>Share your victories on Twitter with card stats</li>
              <li>Track your battle history and ranking</li>
              <li>Challenge friends by sharing your battle link</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-white/60">
              Pro Tip: Use your NFTs from connected wallet for a more personal battle experience!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 