const { Router } = require('express');
const router = new Router();
const User = require('./userRouter');
const Device = require('./deviceRouter');
const Brand = require('./brandRouter');
const Type = require('./typeRouter');
const UserCheck = require('./userCheck');
const Basket = require('./basketRouter');

router.use('/user', User);
router.use('/device', Device);
router.use('/brand', Brand);
router.use('/type', Type);
router.use('/usercheck', UserCheck);
router.use('/basket', Basket);

module.exports = router;
