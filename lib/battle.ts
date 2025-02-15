import { AzukiCard } from './types'

type BattleAction = {
  type: 'attack' | 'special' | 'defend' | 'heal'
  damage?: number
  healing?: number
}

export function calculateAction(
  attacker: AzukiCard,
  defender: AzukiCard,
  action: BattleAction['type']
): BattleAction {
  switch (action) {
    case 'attack':
      return {
        type: 'attack',
        damage: Math.max(0, attacker.stats.attack - defender.stats.defense / 2)
      }
    case 'special':
      return {
        type: 'special',
        damage: attacker.stats.special * 1.5
      }
    case 'defend':
      return {
        type: 'defend',
        healing: defender.stats.defense * 0.3
      }
    case 'heal':
      return {
        type: 'heal',
        healing: 30
      }
    default:
      return { type: 'attack', damage: 0 }
  }
} 