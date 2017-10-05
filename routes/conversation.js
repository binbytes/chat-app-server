import { Router } from 'express'
import Message from '../models/message'
import Conversation from '../models/conversation'

const router = Router()

// Get conversations with recent message of authUser
router.get('/conversations', function (req, res, next) {
  Conversation.find({ participants: req.authUser.id })
    .select('_id, participants')
    .exec((err, conversations) => {
      if (err) {
        res.send({ error: err })
        return next(err)
      }

      return res.status(200).json(conversations)
    })
})

// Get a conversation message
router.get('/conversation/:id', function (req, res, next) {
  Conversation.findOne({ _id: req.params.id })
    .then(conversation => {
      if (conversation) {
        Message.find({ conversationId: conversation._id })
          .select('createdAt body author')
          .then(messages => {
            return res.status(200).json(messages)
          })
      }
    })
})

// Create a conversation
router.post('/conversation', function (req, res, next) {
  if (!req.body.recipient) {
    res.status(422).send({ error: 'Please choose a valid recipient for your message.' })
    return next()
  }

  Conversation.findOne({ participants: [req.authUser.id, req.body.recipient] }, (err, existingConversation) => {
    if (err) { return next(err) }

    if (existingConversation) {
      return res.status(200).json({ conversationId: existingConversation._id })
    }

    const conversation = new Conversation({
      participants: [req.authUser.id, req.body.recipient]
    })

    conversation.save((err, newConversation) => {
      if (err) {
        res.send({ error: err })
        return next(err)
      }

      // Default Welcome message
      const message = new Message({
        conversationId: newConversation._id,
        body: 'I am inviting you to start conversation with me', // later on we can set permission to accpet/declient chat invitation
        author: req.authUser.id
      })

      message.save((err, newMessage) => {
        if (err) {
          res.send({ error: err })
          return next(err)
        }

        return res.status(200).json(newConversation)
      })
    })
  })
})

// Create a conversation
router.post('/send-message/:conversationId', function (req, res, next) {
  const newMessage = req.body.body

  if (!newMessage) {
    return res.status(422).send({ error: 'Message body is required!' })
  }

  const reply = new Message({
    conversationId: req.params.conversationId,
    body: newMessage,
    author: req.authUser.id
  })

  reply.save((err, sentReply) => {
    if (err) {
      res.send({ error: err })
      return next(err)
    }

    // Put the broacast code here
    return res.status(200).json(reply)
  })
})

export default router
