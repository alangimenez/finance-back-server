const express = require('express');
const router = express.Router();
const assetTypeService = require('../../services/accounts/assetTypeService');

router.get('/', async (req, res) => {
    const result = await assetTypeService.getAllAssetType()
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await assetTypeService.createAssetType(req.body)
    res.status(201).json(result)
})

router.post('/associate', async (req, res) => {
    try {
        const result = await assetTypeService.associateTicketWithAssetType(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({"error": "Ha ocurrido un error asociado la cuenta al tipo de activo. Motivo: " + error.message})
    }
})

module.exports = router