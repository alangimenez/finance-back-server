const express = require('express');
const router = express.Router();
const accountService = require('../../services/accounts/accountService');

router.get('/', async (req, res) => {
    res.status(200).json({"message": "App running"});
})

module.exports = router