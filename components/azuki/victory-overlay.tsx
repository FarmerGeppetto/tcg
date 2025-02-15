"use client"

import { useCardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function VictoryOverlay() {
  const opponentHealth = useCardStore((state) => state.opponentHealth)
  const playerHealth = useCardStore((state) => state.playerHealth)
  const playerCard = useCardStore((state) => state.playerCard)
  const opponentCard = useCardStore((state) => state.opponentCard)
  const resetBattle = useCardStore((state) => state.resetBattle)

  // Show when either player is defeated (health <= 0)
  const isGameOver = opponentHealth <= 0 || playerHealth <= 0
  const playerWon = opponentHealth <= 0 && playerHealth > 0

  // Don't show anything if game isn't over or if both players are at 0
  if (!isGameOver || (playerHealth <= 0 && opponentHealth <= 0)) return null
  // Only show victory overlay when player wins
  if (!playerWon) return null

  const handleShare = () => {
    const shareText = `Epic Victory in AZUKI TCG! 🏆\n\n` +
      `My ${playerCard?.id ? `Azuki #${playerCard.id}` : 'warrior'} ` +
      `defeated ${opponentCard?.id ? `Azuki #${opponentCard.id}` : 'opponent'} ` +
      `in an intense battle!\n\n` +
      `Final Stats:\n` +
      `⚔️ ATK: ${playerCard?.stats.attack}\n` +
      `🛡️ DEF: ${playerCard?.stats.defense}\n` +
      `💫 SP: ${playerCard?.stats.special}\n\n` +
      `Join the battle at ${window.location.origin}\n\n` +
      `#AzukiTCG #NFTGaming #Azuki $ANIME`;

    // Create the URL with all parameters
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.append('text', shareText);

    window.open(shareUrl.toString(), '_blank');
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-950/90 border border-white/10 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-center mb-6">Victory! 🎉</h2>
        
        <div className="space-y-6">
          <div className="text-center text-white/80">
            <p>You earned 100 points for winning!</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleShare}
              className="w-full bg-[#1DA1F2] hover:bg-[#1a94e0] h-12 text-lg"
            >
              Share on Twitter
            </Button>

            <Button 
              onClick={resetBattle}
              className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 