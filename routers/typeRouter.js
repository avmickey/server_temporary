const { Router } = require('express');
const router = new Router();
const Type = require('../controllers/TypeControllers');

router.post('/', Type.set);
router.get('/', Type.get);

module.exports = router;
