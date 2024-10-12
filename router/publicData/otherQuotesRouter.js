const express = require('express');
const router = express.Router();
const otherQuotesService = require('../../services/investments/otherQuotesService');

router.get('/cripto', async (req, res) => {
    const response = await otherQuotesService.getCriptoQuotes()
    res.json(response).status(200)
})

module.exports = router