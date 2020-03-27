const db = require('../utils/db')

class Database {
    constructor() {
        console.log('Meting helper created!')
    }

    async save(temperature) {
        let date = new Date()
        date = date.setHours(date.getHours() + 1)
        date = new Date(date)
        const id = await db('metings').insert({
            temperature,
            created_at: date
        })
        const result = await db('metings').where('id', id)
        console.log('Meting saved to database successfully')
        return { meting: result, successfull: true }
    }

    async getTemperatures(num){
        const result = await db('metings').orderBy('id', 'desc').limit(num)
        return result.reverse();
    }
}

exports.default = new Database()
