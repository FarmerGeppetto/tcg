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
      name: 'WATER', 
      effect: 'https://i.gifer.com/XZ5N.gif',
      gradient: 'from-blue-500 to-cyan-300',
      glow: 'shadow-[0_0_50px_rgba(59,130,246,0.5)]'
    },
    { 
      name: 'FIRE', 
      effect: 'https://i.gifer.com/GlIU.gif',
      gradient: 'from-red-500 to-orange-300',
      glow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]'
    },
    { 
      name: 'EARTH', 
      effect: 'https://i.gifer.com/YQDj.gif',
      gradient: 'from-emerald-600 to-lime-300',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.5)]'
    },
    { 
      name: 'LIGHTNING', 
      effect: 'https://i.gifer.com/XZ5L.gif',
      gradient: 'from-blue-400 via-cyan-300 to-yellow-200',
      glow: 'shadow-[0_0_50px_rgba(96,165,250,0.6)]'
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
      <div className="relative w-[800px] h-[600px] flex flex-col items-center">
        {/* Element Name - Now above the GIF */}
        <div className="mb-8 z-10">
          <div className={`
            text-7xl font-bold tracking-wider
            bg-gradient-to-r ${elements[element].gradient} bg-clip-text text-transparent
            ${elements[element].glow}
            animate-pulse transition-all duration-300
            border-2 border-white/20 rounded-lg px-8 py-4
            backdrop-blur-sm bg-black/30
          `}>
            {elements[element].name}
          </div>
          
          {/* Decorative Lines */}
          <div className="mt-4 flex items-center gap-4 justify-center">
            <div className={`h-0.5 w-20 bg-gradient-to-r ${elements[element].gradient} rounded-full`} />
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${elements[element].gradient}`} />
            <div className={`h-0.5 w-20 bg-gradient-to-r ${elements[element].gradient} rounded-full`} />
          </div>
        </div>

        {/* Element GIF */}
        <div className="relative w-full h-full">
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
    </div>
  )
} 