const shell = require('shelljs')
const db = require('../utils/db')

class Meting {
    constructor() {
        this.db = db
        console.log('Meting helper created!')
    }

    static async save(temperature) {
        let date = new Date()
        date = date.setHours(date.getHours() + 1)
        date = new Date(date)
        const id = await db('metings').insert({
            temperature,
            created_at: date
        })
        const result = await db('metings').where('id', id)
        return { meting: result, successfull: true }
    }

    static read() {
        const {
            stdout,
            stderr,
            code
        } = shell.exec('sudo i2cget -y 1 0x48 0x0 b', { silent: true })
        return parseInt(stdout, 16)
    }
}

exports.default = new Meting()
