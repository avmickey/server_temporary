const { Router } = require('express');
const router = new Router();
const Device = require('../controllers/DeviceControllers');

router.post('/', Device.set);
router.get('/', Device.getAll);
router.post('/all', Device.getAllBrandOrType);
router.get('/:id', Device.get);
router.delete('/delete/:id([0-9]+)', Device.delete);

module.exports = router;
