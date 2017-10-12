export default function (io) {

  // Currently lets just keep records of user id & their socket id
  let userSockets = {}

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a socket client connected')

    socket.on('disconnect', () => {
      let userId = userSockets[socket.id]
      delete userSockets[socket.id]

      console.log('disconnect', userId, userSockets)

      if (userId) {
        io.sockets.emit('user-offline', userId)
      }
    })

    socket.on('online-ping', (userId) => {
      if (userId) {
        userSockets[socket.id] = userId
        socket.emit('welcome', { 'test': 'welcome' })
        socket.broadcast.emit('user-online', userId)

        console.log('asdas', Object.values(userSockets))
      }
    })

    socket.on('enter-conversation', (conversation) => {
      socket.join(conversation)
    })

    socket.on('leave-conversation', (conversation) => {
      socket.leave(conversation)
    })

    socket.on('send-message', function (message) {
      socket.broadcast.to(message.conversationId).emit('new-message', message)
    })
  })
}
