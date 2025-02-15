"use client"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm bg-black/20 border-t border-white/10 text-center text-sm text-white/60 z-50">
      <p className="flex items-center justify-center gap-2">
        Made with 💜 for the Azuki community by{" "}
        <a 
          href="https://x.com/farmergeppetto" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          @farmergeppetto
        </a>
        - Give a follow and show some love 🙏
      </p>
    </footer>
  )
} 