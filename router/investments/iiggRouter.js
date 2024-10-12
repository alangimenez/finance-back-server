const express = require('express');
const router = express.Router();
const iiggService = require('../../services/investments/iiggService');

router.post('/', async (req, res) => {
    const result = await iiggService.saveInvestment(req.body);
    res.status(201).json(result)
})

router.get('/', async (req, res) => {
    const result = await iiggService.getInvestments();
    res.status(200).json(result)
})

module.exports = router;