const { CrudMongo } = require('../../crud/crud');
const tirModel = require('../../../models/database/investments/tirMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class tirDao extends CrudMongo {
    constructor() {
        super(tirModel)
    }

    async modifyData(bondName, datetime, tir) {
        try {
            const result = await this.model.updateOne({bondName: bondName}, {$set: {datetime: datetime, tir: tir}})
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }
}

let tirSingleton = new tirDao()

module.exports = tirSingleton