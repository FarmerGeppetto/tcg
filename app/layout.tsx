import './globals.css'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Providers } from "./providers"

const azukiFont = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-azuki',
})

export const metadata = {
  title: 'Azuki TCG',
  description: 'Trading Card Game for the Azuki community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${azukiFont.variable}`}>
      <body className="font-azuki bg-[#0D0D0D]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
