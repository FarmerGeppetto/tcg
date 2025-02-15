"use client"

import { HowToPlay } from "@/components/azuki/how-to-play"
import { Shop } from "@/components/azuki/shop"
import { WalletConnect } from "@/components/azuki/wallet-connect"
import Image from "next/image"

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image 
            src="/azukitcg.png" 
            alt="Azuki TCG Logo" 
            width={40} 
            height={40} 
            className="rounded-lg"
          />
          <div className="text-2xl sm:text-3xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
              AZUKI
            </span>
            <span className="text-white/60 ml-2">TCG</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HowToPlay />
          <Shop />
          <WalletConnect />
        </div>
      </div>
    </nav>
  )
} 