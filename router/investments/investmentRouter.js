const express = require('express');
const router = express.Router();
const investmentService = require('../../services/investments/investmentService');

router.post('/', async (req, res) => {
    const result = await investmentService.saveInvestment(req.body);
    res.status(201).json(result)
})

router.get('/', async (req, res) => {
    const result = await investmentService.getInvestments();
    res.status(200).json(result)
})

router.get('/portfolio', async (req, res) => {
    const result = await investmentService.getPortfolio()
    res.status(200).json(result)
})

module.exports = router;