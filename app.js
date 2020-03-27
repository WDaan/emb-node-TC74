const createError = require('http-errors')
const express = require('express')
const socketIo = require('socket.io')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const hbs = require('hbs')

const app = express()

// Socket.io
const io = socketIo()
app.io = io

const indexRouter = require('./routes/index')(io)
const usersRouter = require('./routes/users')

// socket.io events
io.on('connection', socket => {
    console.log('A user connected')
    app.socket = socket
})

app.temperatureInterval = setInterval(() => {
    // eslint-disable-next-line global-require
    const GPIO = require('./classes/gpio').default
    // eslint-disable-next-line global-require
    const DB = require('./classes/database').default

    const temp = GPIO.getTemperature()

    if (app.socket) {
        console.log('Reading temperature & inputs')
        app.socket.emit('temperature', temp)
        app.socket.emit('inputs', GPIO.readInputs())
    } else {
        console.log('no socket')
    }
    DB.save(temp)
}, 1000)

hbs.registerPartials(`${__dirname}/views/components`)
hbs.registerHelper('stringifyFunc', fn => {
    return new hbs.SafeString(`(${fn.toString().replace(/\"/g, "'")})()`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
