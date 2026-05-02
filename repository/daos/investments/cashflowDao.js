const mongoose = require('mongoose');
const { CrudMongo } = require('../../crud/crud');
const cashflowModel = require('../../../models/database/investments/cashflowMg');

class cashflowDao extends CrudMongo {
    constructor() {
        super(cashflowModel)
    }

    async getActiveBonds() {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        return this.model.find({
            finish: { $gte: thirtyDaysFromNow }
        });
    }
}

let cashFlowSingleton = new cashflowDao()

module.exports = cashFlowSingleton