"use client"

import { Button } from "@/components/ui/button"

type Collection = 'AZUKI' | 'ELEMENTALS' | 'BEANZ'

const collections: { id: Collection; name: string; image: string }[] = [
  {
    id: 'AZUKI',
    name: 'Azuki',
    image: '/collections/azuki.png'
  },
  {
    id: 'ELEMENTALS',
    name: 'Elementals',
    image: '/collections/elementals.png'
  },
  {
    id: 'BEANZ',
    name: 'Beanz',
    image: '/collections/beanz.png'
  }
]

interface CollectionSelectorProps {
  selected: Collection
  onSelect: (collection: Collection) => void
}

export function CollectionSelector({ selected, onSelect }: CollectionSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Select Collection</h2>
      <div className="grid grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Button
            key={collection.id}
            variant="outline"
            className={`
              relative h-24 p-0 overflow-hidden rounded-xl
              ${selected === collection.id ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'}
              transition-all duration-200
            `}
            onClick={() => onSelect(collection.id)}
          >
            <img
              src={collection.image}
              alt={collection.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </Button>
        ))}
      </div>
    </div>
  )
} 