const express = require('express');
const router = express.Router();
const cashFlowService = require('../../services/investments/cashFlowService');

router.get('/', async (req, res) => {
  res.status(200).json(await cashFlowService.getCashFlow());
})

router.post('/', async (req, res, next) => {
  try {
    let result = await cashFlowService.saveCashFlow(req.body);
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/flow', async (req, res) => {
  let result = await cashFlowService.getAllCashFlowSorted()
  res.status(200).json(result)
})

module.exports = router