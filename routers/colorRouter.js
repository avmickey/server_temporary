const { Router } = require('express');
const router = new Router();
const Color = require('../controllers/ColorControllers');

router.post('/', Color.set);
router.get('/', Color.get);

module.exports = router;
