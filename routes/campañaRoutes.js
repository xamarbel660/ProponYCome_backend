// campañasRoutes.js
const express = require('express');
const router = express.Router();
const campañaController = require('../controllers/campañaController');

router.get('/', campañaController.getAllCampañas);
router.get('/graph', campañaController.getCampañaDataGraph);
router.get('/:id', campañaController.getCampañaById);
router.post('/', campañaController.createCampaña);
router.put('/:id', campañaController.updateCampaña);
router.delete('/:id', campañaController.deleteCampaña);

module.exports = router;
