import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()
const secretKey = process.env.SECRET_KEY || '7CigmgctzNfojD5D3eJ7tY62axBuFICn'

router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.get('Authorization') || req.body.token || req.query.token || req.headers['x-access-token']

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, secretKey, function (err, authUser) {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        // if everything is good, save to request for use in other routes
        req.authUser = authUser
        next()
      }
    })
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
})

export default router
