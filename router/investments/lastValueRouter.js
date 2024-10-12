const express = require('express');
const router = express.Router();
const lastValueService = require('../../services/investments/lastValueService');

router.get('/tir', async (req, res) => {
    const result = await lastValueService.getQuotesWithTir();
    res.json(result)
})

router.post('/', async (req, res) => {
    const result = await lastValueService.saveInfo(req.body.quotes);
    res.json(result)
})

router.post('/manualquote', async (req, res) => {
    const result = await lastValueService.saveManualQuote(req.body);
    res.json(result)
})

router.post('/save', async (req, res) => {
    await lastValueService.saveQuotesAndOtherQuotes()
    res.status(201).json()
})

module.exports = router