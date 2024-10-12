const { CrudMongo } = require('../../crud/crud');
const accountModel = require('../../../models/database/accounts/accountMg.js');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class accountDao extends CrudMongo {
    constructor() {
        super(accountModel)
    }

    async updateBalanceByName(account, amount) {
        try {
            const result = await this.model.updateOne({ name: account }, { $set: { balance: amount } })
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }

    async updateBalanceByNameAndCurrency(account, currency, amount) {
        try {
            const result = await this.model.updateOne({ name: account, currency: currency }, { $set: { balance: amount } })
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }

    async getAccountByName(name) {
        try {
            return await this.model.find({ name: name }, { __v: 0 });
        } catch (e) {
            console.log("can't read info by name")
        }
    }

    async getExpenseAccounts() {
        try {
            return await this.model.find({ type: 'R-' }, { __v: 0 })
        } catch (e) {
            console.log("can't read expenses accounts")
        }
    }

    async getLiquidAccounts() {
        try {
            return await this.model.find({ assetType: 'Liquidez' }, { __v: 0 })
        } catch (e) {
            console.log("can't read liquid accounts")
        }
    }

    async getLiquidAndFciAccounts() {
        try {
            return await this.model.find({ $or: [{ assetType: 'Liquidez' }, { assetType: 'FCI' }] }, { __v: 0 })
        } catch (e) {
            console.log("can't read liquid/fci accounts")
        }
    }

    async getAccountsByType(type) {
        try {
            return await this.model.find({ type: type }, { __v: 0 })
        } catch (e) {
            console.log("can't read liquid/fci accounts")
        }
    }

    async getAccountByTicket(ticket) {
        try {
            return await this.model.find({ ticket: ticket }, { __v: 0 })
        } catch (e) {
            console.log("can't read account by ticket")
        }
    }

    async getAccountByNameAndCurrency(name, currency) {
        try {
            return await this.model.find({ name: name, currency: currency }, { __v: 0 });
        } catch (e) {
            console.log("can't read info by name")
        }
    }

    async getAccountsByAssetType(assetType) {
        try {
            return await this.model.find({ assetType: assetType }, { __v: 0 })
        } catch (e) {
            console.log("can't read liquid accounts")
        }
    }
}

let accountSingleton = new accountDao()

module.exports = accountSingleton