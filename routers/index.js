const { Router } = require('express');
const router = new Router();
const User = require('./userRouter');
const Device = require('./deviceRouter');
const Brand = require('./brandRouter');
const Type = require('./typeRouter');
const UserCheck = require('./userCheck');
const Basket = require('./basketRouter');
const Favorite = require('./favoriteRouter');

router.use('/user', User);
router.use('/device', Device);
router.use('/brand', Brand);
router.use('/type', Type);
router.use('/usercheck', UserCheck);
router.use('/basket', Basket);
router.use('/favorite', Favorite);

module.exports = router;
