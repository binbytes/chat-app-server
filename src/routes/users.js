import { Router } from 'express'
import userCtrl from '../controllers/user'

const router = Router()

router.route('/users/me')
  /** GET /api/users - Get logged in user data */
  .get(userCtrl.me)

router.route('/users')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

router.route('/users/:userId')
  /** GET /api/users/:userId - Get single user */
  .get(userCtrl.get)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load)

export default router
