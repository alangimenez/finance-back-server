const express = require('express');
const router = express.Router();
const expenseCreditCardService = require('../../services/creditCard/expenseCreditCardService');

router.post('/', async (req, res) => {
    const result = await expenseCreditCardService.saveExpenseInCreditCard(req.body)
    res.status(200).json(result)
})

router.post('/period', async (req, res) => {
    const result = await expenseCreditCardService.createNewPeriod(req.body)
    res.status(201).json(result)
})

router.post('/period/close', async (req, res) => {
    const result = await expenseCreditCardService.closeCreditCardPeriod()
    res.status(200).json(result)
})

router.get('/period/:status', async (req, res) => {
    const result = await expenseCreditCardService.getPeriodByStatus(req.params.status)
    res.status(200).json(result)
})

router.put('/period/status', async (req, res) => {
    const result = await expenseCreditCardService.changeStatusOfPeriod(req.body)
    res.status(200).json(result)
})

router.get('/expenses', async (req, res) => {
    const result = await expenseCreditCardService.getExpensesByCreditCardAndPeriod(req.query)
    res.status(200).json(result)
})

router.get('/', async (req, res) => {
    const result = await expenseCreditCardService.getExpensesByCreditCard()
    res.status(200).json(result)
})

module.exports = router