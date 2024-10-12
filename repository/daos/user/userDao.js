const { CrudMongo } = require('../../crud/crud');
const userModel = require('../../../models/database/user/userMg');

class userDao extends CrudMongo {
    constructor() {
        super(userModel)
    }

    async getUserByEmail(email) {
        try {
            return await this.model.find({ email: email }, { __v: 0 });
        } catch (e) {
            console.log("can't read user by email")
        }
    }

    async getUser(user) {
        try {
            return await this.model.find({ user: user }, { __v: 0 });
        } catch (e) {
            console.log("can't read user by user")
        }
    }

    async editUser(data) {
        try {
            return await this.model.updateOne({user: data.user}, {$set: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                accessTokenExpires: data.accessTokenExpires,
                refreshTokenExpires: data.refreshTokenExpires
            }});
        } catch (e) {
            console.log("can't edit info: " + e.message)
        }
    }

    async incrementCounter(value) {
        try {
            return await this.model.updateOne({user: "IOL"}, {$set: {
                counter: value
            }});
        } catch (e) {
            console.log("can't edit counter: " + e.message)
        }
    }

    async saveHistoricalCounter(newMonth) {
        try {
            return await this.model.updateOne({user: "IOL"}, {$push: {
                historical: newMonth
            }});
        } catch (e) {
            console.log("can't save historical counter: " + e.message)
        }
    }

    async resetCounter() {
        try {
            return await this.model.updateOne({user: "IOL"}, {$set: {
                counter: 0
            }});
        } catch (e) {
            console.log("can't reset counter: " + e.message)
        }
    }
}

let userSingleton = new userDao()

module.exports = userSingleton