const express = require('express');
const router = express.Router();
const lastValueService = require('../../services/investments/lastValueService');

router.get('/', async (req, res) => {
    const datos = await lastValueService.getAll()
    res.status(200).json(datos)
})

module.exports = router