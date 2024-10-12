const express = require('express');
const router = express.Router();
const scheduledTasksService = require('../../services/scheduledTasks/scheduledTasksService')

router.post('/', async (req, res, next) => {
    try {
        await scheduledTasksService.runScheduledTask(req.body.event)
        res.status(201).json()
    } catch (e) {
        next(e)
    }
    
})

module.exports = router