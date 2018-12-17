import "babel-polyfill"
import './config/log'

import dotEnv from 'dotenv'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import './config/models'

import staticConverterController from './controllers/staticConverterController'
import battles from './controllers/Battles'

dotEnv.config()

const app = express()
const server = http.createServer(app)

const connect = () => {
    const options = { keepAlive: true, keepAliveInitialDelay: 300000, useNewUrlParser: true }
    const db = `mongodb://${process.env.MONGO_CONNECTION}`
    return mongoose.connect(db, options)
}

app.get('/', (req, res) => res.send({ success: true }))
app.get('/list', battles.getBattlesList)
app.get('/count', battles.countBattles)
app.get('/stats', battles.getStatistics)
app.get('/search', battles.searchBattles)

connect().then(
    () => {
        server.listen(process.env.APP_PORT)
        console.log('APP is running!')
        console.trace('APP reachable url: ' + process.env.APP_PORT)

        staticConverterController.check()
    },
    err => console.error('Failed to connect with database ::', err.message)
)