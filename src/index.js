/* eslint-disable no-console */

/**
 * Server setup
 */
import express from 'express'
import chalk from 'chalk'
import './config/database'
import middlewaresConfig from './config/middlewares'
import constants from './config/constants'
import ApiRoutes from './routes'
import socketEvents from './socketEvents'

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

// Wrap all the middlewares with the server
middlewaresConfig(app)

// Add the apiRoutes stack to the server
app.use('/api', ApiRoutes)

server.listen(constants.PORT, err => {
  if (err) {
    console.log(chalk.red('Cannot run!'))
  } else {
    // Socket event
    socketEvents(io)

    //
    console.log(
      chalk.green.bold(
        `
      Yep this is working 🍺
      App listen on port: ${constants.PORT} 🍕
      Env: ${process.env.NODE_ENV} 🦄
    `,
      ),
    )
  }
})
