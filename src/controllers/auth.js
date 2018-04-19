import User from '../models/user'
import jwt from 'jsonwebtoken'
import constants from '../config/constants'

/**
 * Register new user
 * @returns {User}
 */
function register (req, res, next) {
  const { username, name, password } = req.body

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

      res.status(201).json(user)
    })
  })
}

/**
 * Login
 * @returns {User}
 */
function login (req, res, next) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) { return next(err) }

    // If user found unique set session and return user data
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) { return next(err) }

        if (isMatch) {
          return res.json({ token: jwt.sign(user.toJSON(), constants.SECRET_KEY) })
        } else {
          res.status(401).json({ message: 'Bad credentials' })
        }
      })
    } else {
      res.status(401).json({ message: 'Bad credentials' })
    }
  })
}

/**
 * Logout
 */
function logout (req, res, next) {
  // delete req.session.authUser
  res.json({ ok: true })
}

export default { register, login, logout }
