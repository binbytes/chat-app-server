import User from '../models/user'

/**
 * Load user and append to req.
 */
function load (req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get users list.
 * @returns {User[]}
 */
function list (req, res, next) {
  User.find({ _id: { $ne: req.authUser.id } })
    .then(users => {
      res.json(users)
    })
    .catch(error => {
      if (error) { return next(error) }
      // Place error handler here
      res.status(500).send('Something went wrong')
    })
}

/**
 * Get users list.
 * @returns {User[]}
 */
function me (req, res, next) {
  res.status(200).json({ user: req.authUser })
}

/**
 * Get user
 * @returns {User}
 */
function get (req, res) {
  return res.json(req.user)
}

export default { load, get, list, me }
