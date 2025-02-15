import { NextResponse } from 'next/server'

const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY
const CONTRACTS = {
  AZUKI: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
  ELEMENTALS: '0xB6a37b5d14D502c3Ab0Ae6f3a0E058BC9517786e',
  BEANZ: '0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const collection = searchParams.get('collection') as 'AZUKI' | 'ELEMENTALS' | 'BEANZ'

  if (!id || !collection) {
    return NextResponse.json({ error: 'Missing id or collection' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/contract/${CONTRACTS[collection]}/nfts/${id}`,
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY!,
          'Accept': 'application/json'
        }
      }
    )
    
    const data = await response.json()

    // Generate random stats for the NFT
    const baseMin = 40
    const baseMax = 70
    const stats = {
      attack: Math.floor(Math.random() * (baseMax - baseMin)) + baseMin,
      defense: Math.floor(Math.random() * (baseMax - baseMin)) + baseMin,
      special: Math.floor(Math.random() * (baseMax - baseMin)) + baseMin,
    }

    return NextResponse.json({
      stats,
      image: data.nft.image_url || '/placeholder.jpg'
    })
  } catch (error) {
    console.error('Error fetching NFT:', error)
    return NextResponse.json({ error: 'Failed to fetch NFT' }, { status: 500 })
  }
} 