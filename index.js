import express from 'express'
import routes from './routes'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import socketEvents from './socketEvents'
import cors from 'cors'
import env from 'dotenv-loader'

env.load('.env')

const app = express()
const host = process.env.HOST || null
const port = process.env.PORT || 3002
const DB_URI = process.env.DB_URL
const server = require('http').createServer(app)

mongoose.connect(DB_URI)

app.set('port', port)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors({
  credentials: true,
  origin: process.env.FRONT_ORIGIN // Change allowed origin url for production, todo: load it from env
}))

const io = require('socket.io').listen(server)

// Bind socket events
socketEvents(io)

// Import API Routes
app.use('/api', routes)

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + (host == null ? host : 'localhost') + ':' + port) // eslint-disable-line no-console
