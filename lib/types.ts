export interface AzukiCard {
  id: string;
  stats: {
    attack: number;
    defense: number;
    special: number;
  };
  image: string;
}

export interface Battle {
  id: string;
  winner_card_id: string;
  loser_card_id: string;
  battle_date: string;
  opponent_username: string;
  won: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  effect: string;
} 