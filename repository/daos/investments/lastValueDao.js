const { CrudMongo } = require('../../crud/crud');
const lastValue = require('../../../models/database/investments/lastValueMg.js');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class lastValueDao extends CrudMongo {
    constructor() {
        super(lastValue)
    }

    /* async eliminarTodos(bondName) {
        try {
            const result = await this.model.deleteMany();
            return this.leerInfo();
        } catch (e) {
            console.log('cant eliminar info')
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message, res);
        }
    } */

    async modifyValues(bond) {
        try {
            const result = await this.model.updateOne({ticket: bond.ticket}, {$set: {price: bond.price, volume: bond.volumen}})
            return result
        } catch (e) {
            console.log("Can't delete info in modifyValues")
        }
    }

    async getQuotesByTicket(ticket) {
        try {
            const result = await this.model.find({ticket: ticket}, { __v: 0 })
            return result
        } catch (e) {
            console.log("Can't read info by ticket")
        }
    }

    async getLastRegister() {
        try {
            const result = await this.model.find().sort({$natural:-1}).limit(1)
            return result[0]
        } catch (e) {
            console.log("Can't read info by ticket")
        }
    }

    async deleteLastRegister(id) {
        try {
            const result = await this.model.deleteOne({_id: id})
            return
        } catch (e) {
            console.log("Can't read info by ticket")
        }
    }
}

let lastValueSingleton = new lastValueDao()

module.exports = lastValueSingleton