const { Gpio } = require('onoff')

const relais = new Gpio(23, 'out')
const GPIO = require('./classes/gpio').default
const DB = require('./classes/database').default

console.log(GPIO.getTemperature())

DB.save(GPIO.getTemperature())