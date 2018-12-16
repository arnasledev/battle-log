import "babel-polyfill"
import './config/log'

import dotEnv from 'dotenv'
import express from 'express'
import compression from 'compression'
import http from 'http'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import './config/models'

import staticConverterController from './controllers/staticConverterController'

dotEnv.config()

const app = express()
const server = http.createServer(app)

const connect = () => {
    const options = { keepAlive: true, keepAliveInitialDelay: 300000, useNewUrlParser: true }
    const db = `mongodb://${process.env.MONGO_CONNECTION}`
    return mongoose.connect(db, options)
}

app.enable('trust proxy')
app.use(compression())
app.set('trust proxy', 'loopback')
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

connect().then(
    () => {
        server.listen(process.env.APP_PORT)
        console.log('APP is running!')
        console.trace('APP reachable url: ' + process.env.APP_PORT)

        staticConverterController.check()
    },
    err => console.error('Failed to connect with database ::', err.message)
)