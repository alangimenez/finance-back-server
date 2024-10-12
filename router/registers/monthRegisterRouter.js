const express = require('express');
const router = express.Router();
const monthRegisterService = require('../../services/registers/monthRegisterService')

router.post('/', async (req, res) => {
    const result = await monthRegisterService.saveMonthRegister()
    res.status(201).json(result)
})

router.get('/', async (req, res) => {
    const result = await monthRegisterService.getAllMonthRegisters()
    res.status(200).json(result)
})

router.get('/date', async (req, res) => {
    const result = await monthRegisterService.getMonthRegisterByYearAndMonth(req.query)
    res.status(200).json(result)
})

router.get('/periods', async (req, res) => {
    const result = await monthRegisterService.getPeriodsRegistered()
    res.status(200).json(result)
})

module.exports = router