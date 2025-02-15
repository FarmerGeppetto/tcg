import { Server } from 'socket.io'

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join_battle', (battleId) => {
      socket.join(battleId)
      io.to(battleId).emit('player_joined', socket.id)
    })

    socket.on('perform_action', (data) => {
      const { battleId, action, playerWallet } = data
      io.to(battleId).emit('action_performed', {
        action,
        playerWallet,
        timestamp: Date.now()
      })
    })

    socket.on('send_message', (data) => {
      const { battleId, message, username } = data
      io.to(battleId).emit('new_message', {
        message,
        username,
        timestamp: Date.now()
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
} 