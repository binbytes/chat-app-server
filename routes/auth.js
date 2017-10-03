import { Router } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'

const router = Router()
const secretKey = process.env.secretKey || '7CigmgctzNfojD5D3eJ7tY62axBuFICn'

// Add POST - /api/register
router.post('/auth/register', (req, res, next) => {
  // Check for registration errors
  const username = req.body.username
  const name = req.body.name
  const password = req.body.password

  // Return error if username is not provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter an username.' })
  }

  // Return error if name not provided
  if (!name) {
    return res.status(422).send({ error: 'You must enter name.' })
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' })
  }

  User.findOne({ username: username }, (err, existingUser) => {
    if (err) { return next(err) }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That username is already in use.' })
    }

    // If username is unique and password was provided, create account
    const user = new User({
      username,
      password,
      name
    })

    user.save((err, user) => {
      if (err) { return next(err) }

      req.session.authUser = user.toJSON()

      res.status(201).json(user)
    })
  })
})

// Add POST - /api/login
router.post('/auth/login', (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) { return next(err) }

    // If user found unique set session and return user data
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) { return next(err) }

        if (isMatch) {
          return res.json({ token: jwt.sign(user.toJSON(), secretKey) })
        } else {
          res.status(401).json({ message: 'Bad credentials' })
        }
      })
    } else {
      res.status(401).json({ message: 'Bad credentials' })
    }
  })
})

// Add POST - /api/logout
router.post('/auth/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

export default router
