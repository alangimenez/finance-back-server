const express = require('express');
const router = express.Router();
const registerService = require('../../services/registers/registerService');

router.get('/account', async (req, res) => {
    const result = await registerService.getRegisterByAccount(req.query.account)
    res.status(200).json(result)
})

module.exports = router