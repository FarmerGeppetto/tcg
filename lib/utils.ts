import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AzukiCard } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLLECTION_RANGES = {
  AZUKI: { min: 1, max: 10000 },
  ELEMENTALS: { min: 1, max: 4444 },
  BEANZ: { min: 1, max: 19950 }
}

export function generateRandomNFTId(collection: 'AZUKI' | 'ELEMENTALS' | 'BEANZ'): string {
  const range = COLLECTION_RANGES[collection]
  return Math.floor(Math.random() * (range.max - range.min + 1) + range.min).toString()
}

const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY
const CONTRACTS = {
  AZUKI: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
  ELEMENTALS: '0xB6a37b5d14D502c3Ab0Ae6f3a0E058BC9517786e',
  BEANZ: '0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949'
}

export async function fetchAzukiNFTs(collection: 'AZUKI' | 'ELEMENTALS' | 'BEANZ' = 'ELEMENTALS', offset = 0, limit = 50) {
  try {
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/contract/${CONTRACTS[collection]}/nfts?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY!,
          'Accept': 'application/json'
        }
      }
    )
    
    const data = await response.json()
    return data.nfts || []
  } catch (error) {
    console.error('Error fetching NFTs:', error)
    return []
  }
}

export async function fetchNFTData(id: string, collection: 'AZUKI' | 'ELEMENTALS' | 'BEANZ' = 'ELEMENTALS'): Promise<AzukiCard> {
  try {
    const response = await fetch(`/api/nft?id=${id}&collection=${collection}`)
    const data = await response.json()
    return {
      id,
      stats: data.stats,
      image: data.image
    }
  } catch (error) {
    console.error('Error fetching NFT data:', error)
    throw error
  }
}

export async function preloadAzukiIds(collection: 'AZUKI' | 'ELEMENTALS' | 'BEANZ' = 'ELEMENTALS'): Promise<string[]> {
  const nfts = await fetchAzukiNFTs(collection)
  return Array.isArray(nfts) ? nfts.map(nft => nft.identifier) : []
}

interface NFTMetadata {
  id: string
  collection: 'AZUKI' | 'ELEMENTALS' | 'BEANZ'
}

interface AlchemyNFT {
  id: {
    tokenId: string;
  };
}

export async function fetchNFTsByOwner(address: string): Promise<NFTMetadata[]> {
  try {
    // Fetch Azuki NFTs
    const azukiResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTs?owner=${address}&contractAddresses[]=0xED5AF388653567Af2F388E6224dC7C4b3241C544`
    )
    const azukiData = await azukiResponse.json()

    // Fetch Elementals NFTs
    const elementalsResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTs?owner=${address}&contractAddresses[]=0xB6a37b5d14D502c3Ab0Ae6f3a0E058BC9517786e`
    )
    const elementalsData = await elementalsResponse.json()

    // Fetch BEANZ NFTs
    const beanzResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTs?owner=${address}&contractAddresses[]=0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949`
    )
    const beanzData = await beanzResponse.json()

    const nfts: NFTMetadata[] = [
      ...azukiData.ownedNfts.map((nft: AlchemyNFT) => ({
        id: nft.id.tokenId,
        collection: 'AZUKI'
      })),
      ...elementalsData.ownedNfts.map((nft: AlchemyNFT) => ({
        id: nft.id.tokenId,
        collection: 'ELEMENTALS'
      })),
      ...beanzData.ownedNfts.map((nft: AlchemyNFT) => ({
        id: nft.id.tokenId,
        collection: 'BEANZ'
      }))
    ]

    return nfts
  } catch (error) {
    console.error('Error fetching NFTs:', error)
    return []
  }
}
