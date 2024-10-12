const express = require('express');
const router = express.Router();
const quotesService = require('../../services/investments/quotesService');

router.delete('/all', async (req, res) => {
    const result = await quotesService.deleteAllQuotesByBondName(req.body.bondName);
    if (result.deletedCount > 0) {
        res.status(202).json(`Se han eliminado ${result.deletedCount} registros`)
    } else {
        res.status(400).json(`No se ha eliminado ningun registro`)
    }

})

router.post('/', async (req, res) => {
    const result = await quotesService.saveInfo(req.body.quotes);
    res.json(result);
})

router.post('/iol', async (req, res) => {
    await quotesService.saveInfoFromIol();
    res.json({message: "ok"}).status(201)
})

module.exports = router