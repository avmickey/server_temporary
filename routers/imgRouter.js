const { Router } = require('express');
const router = new Router();
const Image = require('../controllers/ImageControllers');

router.post('/', Image.set);
router.get('/', Image.get);
router.delete('/:id', Image.delete);

module.exports = router;
