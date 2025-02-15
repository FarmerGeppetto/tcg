"use client"

import { useEffect, useState } from 'react'
import { useCardStore } from '@/lib/store'
import { io } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  username: string
  message: string
  timestamp: number
}

export function BattleRoom({ battleId }: { battleId: string }) {
  const [socket, setSocket] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const playerWallet = useCardStore((state) => state.playerWallet)
  const playerEns = useCardStore((state) => state.playerEns)
  const isPlayerTurn = useCardStore((state) => state.isPlayerTurn)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!)
    setSocket(newSocket)

    newSocket.emit('join_battle', battleId)

    newSocket.on('action_performed', (data) => {
      // Handle opponent's action
      if (data.playerWallet !== playerWallet) {
        useCardStore.getState().performAction(data.action)
      }
    })

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      newSocket.close()
    }
  }, [battleId, playerWallet])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    socket.emit('send_message', {
      battleId,
      message: newMessage,
      username: playerEns || playerWallet?.slice(0, 6)
    })
    setNewMessage('')
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/90 rounded-lg border border-white/10 shadow-xl">
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Battle Chat</h3>
          <div className="h-48 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-purple-400">{msg.username}: </span>
                <span className="text-white/80">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="text-sm text-white/60">
          {isPlayerTurn ? "Your turn" : "Opponent's turn"}
        </div>
      </div>
    </div>
  )
} 