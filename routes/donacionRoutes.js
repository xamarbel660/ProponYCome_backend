// donacionRoutes.js
const express = require('express');
const router = express.Router();
const donacionController = require('../controllers/donacionController');

router.get('/', donacionController.getAllDonaciones);
router.get('/:id', donacionController.getDonacionById);
router.get('/cards/:page', donacionController.getAllDonacionesCards);
router.post('/', donacionController.createDonacion);
router.put('/:id', donacionController.updateDonacion);
router.delete('/:id', donacionController.deleteDonacion);

module.exports = router;