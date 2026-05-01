const express = require('express');
const router = express.Router();
const tirService = require('../../services/investments/tirService');
const tirByInterpolationService = require('../../services/investments/tirByInterpolationService');
const lastValueService = require('../../services/investments/lastValueService');

router.get('/interpolation', async (req, res) => {
    try {
        const { mode = 'lastvalue' } = req.query;
        if (mode !== 'lastvalue' && mode !== 'online') {
            return res.status(400).json({ error: `Invalid mode '${mode}'. Must be 'online' or 'lastvalue'.` });
        }
        if (mode === 'online') {
            await lastValueService.saveQuotesAndOtherQuotes();
        }
        const result = await tirByInterpolationService.getTirs();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

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