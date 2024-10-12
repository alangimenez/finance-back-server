const express = require('express');
const router = express.Router();
const tirService = require('../../services/investments/tirService');

router.get('/', async (req, res) => {
    res.status(200).json(await tirService.getTir())
})

router.get('/daily', async (req, res) => {
    res.status(200).json(await tirService.getTirDaily())
})

router.post('/daily', async (req, res) => {
    res.status(200).json(await tirService.generateTirDaily())
})

router.post('/', async (req, res) => {
    res.status(200).json(await tirService.generateTir())
})

module.exports = router