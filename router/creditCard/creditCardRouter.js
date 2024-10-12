const express = require('express');
const router = express.Router();
const creditCardService = require('../../services/creditCard/creditCardService');

router.get('/', async (req, res) => {
    const result = await creditCardService.getAllCreditCards()
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await creditCardService.createNewCreditCard(req.body)
    res.status(201).json(result)
})

module.exports = router