"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ElementLoaderProps {
  onComplete: () => void
}

export function ElementLoader({ onComplete }: ElementLoaderProps) {
  const [show, setShow] = useState(true)
  const [element, setElement] = useState(0)

  const elements = [
    { 
      name: 'water', 
      effect: 'https://i.gifer.com/XZ5N.gif'  // Water
    },
    { 
      name: 'fire', 
      effect: 'https://i.gifer.com/GlIU.gif'  // Fire
    },
    { 
      name: 'earth', 
      effect: 'https://i.gifer.com/YQDj.gif'  // earth
    },
    { 
      name: 'wind', 
      effect: 'https://i.gifer.com/XZ5L.gif'  // Lightining
    }
  ]

  useEffect(() => {
    let elementIndex = 0
    const elementInterval = setInterval(() => {
      elementIndex++
      if (elementIndex < elements.length) {
        setElement(elementIndex)
      } else {
        clearInterval(elementInterval)
        setTimeout(() => {
          setShow(false)
          onComplete()
        }, 500)
      }
    }, 1500)

    return () => clearInterval(elementInterval)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="relative w-[800px] h-[600px]">
        <Image
          src={elements[element].effect}
          alt={elements[element].name}
          fill
          className="object-contain transition-opacity duration-300"
          priority
          unoptimized
        />
      </div>
    </div>
  )
} 