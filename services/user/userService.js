const userDao = require('../../repository/daos/user/userDao')
const iolApiClient = require('../../clients/iolApiClient')
const { convertRequest } = require('../../utils/utils')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../../config/config.environments');
const moment = require('moment');

class UserService {
    constructor() { }

    async registerNewUser(request) {
        const user = convertRequest(request)
        let hashPassword = ""
        try {
            hashPassword = await bcrypt.hash(user.password, 10)
        } catch (e) {
            console.log(e)
        }

        await userDao.subirInfo({
            "email": user.email,
            "password": hashPassword
        })

        return { "message": "ok" }
    }

    async loginUser(request) {
        const user = convertRequest(request)
        let token = ""

        const dataUser = await userDao.getUserByEmail(user.email)

        const passwordCheck = await bcrypt.compare(user.password, dataUser[0].password)

        if (passwordCheck) {
            token = jwt.sign(
                {
                    userId: dataUser[0]._id,
                    userEmail: dataUser[0].email
                },
                config.PRIVATE_KEY,
                { expiresIn: "1h" }
            )
        } else {
            return { "message": "Error" }
        }

        return {
            "email": dataUser[0].email,
            "token": token
        }
    }

    async getAccessTokenToOperateIol() {
        const token = await userDao.getUser("IOL")

        if (moment(new Date()).isBefore(token[0].accessTokenExpires)) {
            return token[0].access_token
        }

        let dataAccessToken
        if (moment(new Date()).isBefore(token[0].refreshTokenExpires)) {
            dataAccessToken = await iolApiClient.getRefreshTokenFromIol(token[0].refresh_token)
        } else {
            dataAccessToken = await iolApiClient.getAccessTokenFromIol()
        }

        await this.#saveTokenFromIol(dataAccessToken)
        return dataAccessToken.access_token
    }

    async resetCounterOfIolClient() {
        const userData = await userDao.getUser("IOL")
        const newMonth = {
            date: new Date(),
            counter: userData[0].counter
        }
        await userDao.saveHistoricalCounter(newMonth)
        await userDao.resetCounter()
        return
    }

    async #saveTokenFromIol(token) {
        await userDao.editUser({
            user: "IOL",
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            accessTokenExpires: new Date(token['.expires']),
            refreshTokenExpires: new Date(token['.refreshexpires'])
        })
    }
}

const userService = new UserService()

module.exports = userService