import { create } from 'zustand';
import { AzukiCard, ShopItem } from './types';
import { toast } from 'sonner';

interface ActionState {
  remainingUses: number;
  cooldown: number;
  lastUsed?: number;
}

interface CardState {
  playerCard: AzukiCard | null;
  opponentCard: AzukiCard | null;
  playerHealth: number;
  opponentHealth: number;
  isPlayerTurn: boolean;
  battleLog: string[];
  playerWallet: string | null;
  opponentWallet: string | null;
  playerEns: string | null;
  playerAvatar: string | null;
  inventory: ShopItem[];
  actionStates: {
    attack: ActionState;
    special: ActionState;
    defend: ActionState;
    heal: ActionState;
  };
  setPlayerCard: (card: AzukiCard | null) => void;
  setOpponentCard: (card: AzukiCard | null) => void;
  setPlayerWallet: (address: string | null) => void;
  setOpponentWallet: (address: string | null) => void;
  setPlayerEns: (ens: string | null) => void;
  setPlayerAvatar: (avatar: string | null) => void;
  performAction: (action: 'attack' | 'special' | 'defend' | 'heal') => void;
  resetBattle: () => void;
  getPlayerPoints: () => Promise<number>;
  addInventoryItem: (item: ShopItem) => void;
  useInventoryItem: (itemId: string) => void;
  resetActionStates: () => void;
}

export const useCardStore = create<CardState>((set, get) => ({
  playerCard: null,
  opponentCard: null,
  playerHealth: 100,
  opponentHealth: 100,
  isPlayerTurn: true,
  battleLog: [],
  playerWallet: null,
  opponentWallet: null,
  playerEns: null,
  playerAvatar: null,
  inventory: [],
  actionStates: {
    attack: { remainingUses: Infinity, cooldown: 0 },
    special: { remainingUses: 3, cooldown: 2 }, // 3 uses, 2 turns cooldown
    defend: { remainingUses: 5, cooldown: 1 }, // 5 uses, 1 turn cooldown
    heal: { remainingUses: 2, cooldown: 3 }, // 2 uses, 3 turns cooldown
  },

  setPlayerCard: (card) => set({ playerCard: card, playerHealth: 100 }),
  setOpponentCard: (card) => set({ opponentCard: card, opponentHealth: 100 }),
  setPlayerWallet: (address) => set({ playerWallet: address }),
  setOpponentWallet: (address) => set({ opponentWallet: address }),
  setPlayerEns: (ens) => set({ playerEns: ens }),
  setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),

  getPlayerPoints: async () => {
    const { playerWallet } = get();
    if (!playerWallet) return 0;

    try {
      const response = await fetch(`/api/players?wallet_address=${playerWallet}`);
      if (response.ok) {
        const player = await response.json();
        return player.points || 0;
      }
    } catch (error) {
      console.error('Error fetching player points:', error);
    }
    return 0;
  },

  performAction: (action) => {
    const { actionStates, isPlayerTurn, playerCard, opponentCard, playerWallet, opponentWallet } = get();
    const actionState = actionStates[action];

    // Check if action can be used
    if (actionState.remainingUses <= 0) {
      toast.error("No remaining uses for this action!");
      return;
    }

    const currentTurn = Date.now();
    if (actionState.lastUsed && actionState.cooldown > 0) {
      const turnsSinceLastUse = Math.floor((currentTurn - actionState.lastUsed) / 1000); // assuming 1 second per turn
      if (turnsSinceLastUse < actionState.cooldown) {
        toast.error(`This action is on cooldown for ${actionState.cooldown - turnsSinceLastUse} more turns!`);
        return;
      }
    }

    // Update action state
    set((state) => ({
      actionStates: {
        ...state.actionStates,
        [action]: {
          ...actionState,
          remainingUses: actionState.remainingUses === Infinity ? Infinity : actionState.remainingUses - 1,
          lastUsed: currentTurn
        }
      }
    }));

    if (!playerCard || !opponentCard) return;

    set((state) => {
      const attacker = isPlayerTurn ? playerCard : opponentCard;
      const defender = isPlayerTurn ? opponentCard : playerCard;
      let damage = 0;
      let healing = 0;
      let log = '';

      switch (action) {
        case 'attack':
          damage = Math.floor(attacker.stats.attack - defender.stats.defense * 0.5);
          damage = Math.max(damage, 1); // Minimum 1 damage
          log = isPlayerTurn ? 
            `<span class="text-blue-400">Player</span> attacks for ${damage} damage` :
            `<span class="text-red-400">Opponent</span> attacks for ${damage} damage`;
          break;

        case 'special':
          damage = Math.floor(attacker.stats.special * 1.2);
          log = isPlayerTurn ?
            `<span class="text-blue-400">Player</span> uses special attack for ${damage} damage` :
            `<span class="text-red-400">Opponent</span> uses special attack for ${damage} damage`;
          break;

        case 'defend':
          healing = Math.floor(attacker.stats.defense * 0.3);
          log = isPlayerTurn ?
            `<span class="text-blue-400">Player</span> defends and recovers ${healing} HP` :
            `<span class="text-red-400">Opponent</span> defends and recovers ${healing} HP`;
          break;

        case 'heal':
          healing = 20;
          log = isPlayerTurn ?
            `<span class="text-blue-400">Player</span> heals for ${healing} HP` :
            `<span class="text-red-400">Opponent</span> heals for ${healing} HP`;
          break;
      }

      // Calculate new health values
      let newPlayerHealth = state.playerHealth;
      let newOpponentHealth = state.opponentHealth;

      if (isPlayerTurn) {
        // Player's turn
        newOpponentHealth = Math.max(0, newOpponentHealth - damage);
        newPlayerHealth = Math.min(100, newPlayerHealth + healing);
      } else {
        // Opponent's turn
        newPlayerHealth = Math.max(0, newPlayerHealth - damage);
        newOpponentHealth = Math.min(100, newOpponentHealth + healing);
      }

      // Ensure health values are properly bounded
      newPlayerHealth = Math.max(0, Math.min(100, newPlayerHealth));
      newOpponentHealth = Math.max(0, Math.min(100, newOpponentHealth));

      // Add game over message to log
      if (newPlayerHealth <= 0) {
        log += '\n<span class="text-red-400">Game Over - Opponent Wins! 🏆</span> <span class="text-blue-400">Player loses 😢</span>';
      } else if (newOpponentHealth <= 0) {
        log += '\n<span class="text-blue-400">Game Over - Player Wins! 🏆</span> <span class="text-red-400">Opponent loses 😢</span>';
      }

      // Handle battle recording and points
      if (newPlayerHealth <= 0 || newOpponentHealth <= 0) {
        if (playerWallet && opponentWallet) {
          const playerWon = newOpponentHealth <= 0;
          const pointsToAdd = playerWon ? 100 : 25;

          // Update points in database and store
          fetch('/api/battles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              winner_address: playerWon ? playerWallet : opponentWallet,
              loser_address: playerWon ? opponentWallet : playerWallet,
              winner_card_id: playerWon ? playerCard?.id : opponentCard?.id,
              loser_card_id: playerWon ? opponentCard?.id : playerCard?.id,
              points: pointsToAdd
            })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success && playerWon) {
              console.log('Points updated:', data.points); // Debug log
              get().getPlayerPoints(); // Refresh points from server
            }
          })
          .catch(error => {
            console.error('Error updating points:', error);
          });
        }
      }

      return {
        playerHealth: newPlayerHealth,
        opponentHealth: newOpponentHealth,
        isPlayerTurn: !state.isPlayerTurn,
        battleLog: [log, ...state.battleLog].slice(0, 5)
      };
    });
  },

  resetBattle: () => set((state) => ({
    playerHealth: 100,
    opponentHealth: 100,
    isPlayerTurn: true,
    battleLog: [],
    actionStates: {
      attack: { remainingUses: Infinity, cooldown: 0 },
      special: { remainingUses: 3, cooldown: 2 },
      defend: { remainingUses: 5, cooldown: 1 },
      heal: { remainingUses: 2, cooldown: 3 },
    }
  })),

  addInventoryItem: (item) => set((state) => ({
    inventory: [...state.inventory, item]
  })),

  useInventoryItem: (itemId) => set((state) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (!item) return state;

    // Apply item effects
    switch (item.effect) {
      case 'heal-full':
        return {
          playerHealth: 100,
          inventory: state.inventory.filter(i => i.id !== itemId)
        };
      // Add other effects
    }

    return state;
  }),

  resetActionStates: () => set({
    actionStates: {
      attack: { remainingUses: Infinity, cooldown: 0 },
      special: { remainingUses: 3, cooldown: 2 },
      defend: { remainingUses: 5, cooldown: 1 },
      heal: { remainingUses: 2, cooldown: 3 },
    }
  })
})); 