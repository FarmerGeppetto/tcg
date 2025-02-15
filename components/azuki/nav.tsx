"use client"

import { HowToPlay } from "@/components/azuki/how-to-play"
import { Shop } from "@/components/azuki/shop"
import { WalletConnect } from "@/components/azuki/wallet-connect"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop & Mobile Layout */}
        <div className="flex justify-between items-center">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <HowToPlay />
            <Shop />
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white/80" />
            ) : (
              <Menu className="w-6 h-6 text-white/80" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-white/5 mt-3">
            <div className="flex flex-col gap-2">
              <div className="w-full">
                <HowToPlay />
              </div>
              <div className="w-full">
                <Shop />
              </div>
              <div className="w-full">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 