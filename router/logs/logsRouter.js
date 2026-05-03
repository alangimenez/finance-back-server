const express = require('express');
const router = express.Router();
const logService = require('../../services/logs/logService');
const logsValidator = require('../../services/logs/logsValidator');

router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, labels } = req.query

        let parsedLabels = undefined
        if (labels) {
            parsedLabels = Array.isArray(labels) ? labels : labels.split(',')
        }

        const validation = logsValidator.validateGetLogs({
            startDate,
            endDate,
            labels: parsedLabels
        })

        if (!validation.isValid) {
            return res.status(400).json({ errors: validation.errors })
        }

        const logs = await logService.getLogs({
            startDate,
            endDate,
            labels: parsedLabels
        })

        res.status(200).json(logs)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router