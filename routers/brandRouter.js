const { Router } = require('express');
const router = new Router();
const Brand = require('../controllers/BrandControllers');

router.post('/', Brand.set);
router.get('/', Brand.get);

module.exports = router;
