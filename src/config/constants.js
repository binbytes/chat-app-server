import env from 'dotenv-loader'

env.load('.env')

const defaultConfig = {
  HOST: process.env.HOST || 3000,
  PORT: process.env.PORT || 3002,
  RAVEN_ID: process.env.RAVEN_ID,
  DB_URL: process.env.DB_URL || 'mongodb://localhost/nuxt-chat-app',
  SECRET_KEY: process.env.SECRET_KEY || 'ewtijwebgiuweg9w98u928398t!!u1dh28h1t1h9u9h@$$'
}

export default {
  ...defaultConfig
}
