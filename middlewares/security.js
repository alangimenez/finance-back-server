const config = require('../config/config.environments');

class MidSecurity {
    constructor() {}

    checkPassword (req, res, next) {
        // const indexHeader = req.headers.findIndex((e) => e == 'Password-Security')
        if (req.headers.password == config.WORD_SECRET) {
            next()
        } else {
            res.status(401).json({"error_message": "You are not allowed to do this operation"})
        }
    }
}

const midSecurity = new MidSecurity()

module.exports = midSecurity