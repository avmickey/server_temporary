const Router = require('express');
const router = new Router();
const User = require('../controllers/UserControllers.js');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', User.registration);
router.post('/login', User.login);
router.get('/check', authMiddleware, User.check);
router.get('/delete', authMiddleware, User.delete);

module.exports = router;
