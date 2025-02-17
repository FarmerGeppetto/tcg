"use client"

import { useState, useEffect } from 'react'
import SoundManager from '@/lib/sounds'

export function FightIntro({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3)
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Play the combined countdown + fight sound once at start
    if (count === 3) {
      SoundManager.play('fight')
    }

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (count === 0) {
      const timer = setTimeout(() => {
        setShow(false)
        onComplete()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {count > 0 ? (
          <div className="text-8xl font-bold text-white animate-bounce">
            {count}
          </div>
        ) : (
          <div className="text-8xl font-bold text-red-500 animate-pulse">
            FIGHT!
          </div>
        )}
      </div>
    </div>
  )
} 