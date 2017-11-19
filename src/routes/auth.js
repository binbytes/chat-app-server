import { Router } from 'express'
import authCtrl from '../controllers/auth'

const router = Router()

// Add POST - /api/register
router.post('/auth/register', authCtrl.register)

// Add POST - /api/login
router.post('/auth/login', authCtrl.login)

// Add POST - /api/logout
router.post('/auth/logout', authCtrl.logout)

export default router
