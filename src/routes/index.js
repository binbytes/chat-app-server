import { Router } from 'express'
import users from './users'
import auth from './auth'
import jwt from './jwt'
import conversation from './conversation'

const router = Router()

// Add Routes
router.use(auth)
router.use(jwt)
router.use(users)
router.use(conversation)

export default router
