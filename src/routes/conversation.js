import { Router } from 'express'
import ConversationCtrl from '../controllers/conversation'

const router = Router()

router.route('/conversations')
  /** GET /api/conversations - Get conversations list */
  .get(ConversationCtrl.list)

// Get a conversation message
router.get('/conversation/:id', ConversationCtrl.get)

router.post('/conversation', ConversationCtrl.create)

router.post('/send-message/:conversationId', ConversationCtrl.createMessage)

export default router
