const express = require('express');
const router = express.Router();
const refundService = require('../../services/registers/refundService');

router.get('/', async (req, res) => {
    const result = await refundService.getAllRefunds()
    res.status(200).json(result)
})

router.post('/expense', async (req, res) => {
    const result = await refundService.createExpenseWithRefund(req.body)
    res.status(201).json(result)
})

router.post('/', async (req, res) => {
    const result = await refundService.uploadRefund(req.body)
    res.status(201).json(result)
})

module.exports = router