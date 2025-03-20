const express = require('express');
const router = express.Router();
const lastValueService = require('../../services/investments/lastValueService');

router.get('/', async (req, res) => {
    const datos = await lastValueService.getAll()
    res.status(200).json(datos)
})

router.get('/actualquotes', async (req, res) => {
    const response = await lastValueService.getQuotesInRealTime()
    res.status(200).json(response)
})

module.exports = router