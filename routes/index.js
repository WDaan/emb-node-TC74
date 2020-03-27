module.exports = function (io) {
    const express = require('express')

    const router = express.Router()

    /** GPIO */
    const GPIO = require('../classes/gpio').default

    /** DB */
    const DB = require('../classes/database').default

    /** SOCKET.IO */
    io.on('connection', socket => {
        socket.on('on', () => {
            console.log('Turning on relais...')
            GPIO.relaisOn()
        })
        socket.on('off', () => {
            console.log('Turning off relais...')
            GPIO.relaisOff()
        })
    })

    /* GET home page. */
    router.get('/', (req, res, next) => {
        res.render('index')
    })

    /* GET temperature data */
    router.get('/temperatures', async (req, res, next) => {
        const { num } = req.query
        const result = await DB.getTemperatures(num)
        res.json(result)
    })

    return router
}
