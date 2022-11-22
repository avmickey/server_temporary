// const BasketDevice = require( '../models/BasketProduct.js')
// const APIError = require('../errors/APIError.js');

// const check = async (req, res, next) => {
//     try {
//         if (!req.signedCookies.basketId) {
//             throw new Error('Корзина еще не создана')
//         }
//         const exist = await BasketModel.isExist(req.signedCookies.basketId)
//         if (!exist)) {
//             res.clearCookie('basketId')
//             throw new Error('Корзина не найдена в БД')
//         }
//     } catch(e) {
//         next(APIError.badRequest(e.message))
//     }
// }

// class BasketDeviceControllers {
//     async getAll(req, res, next) {
//         await check(req, res, next) // проверяем существование корзины
//         try {
//             const products = await BasketDevice.getAll(req.signedCookies.basketId)
//             res.json(products)
//         } catch(e) {
//             next(APIError.badRequest(e.message))
//         }
//     }

//     async create(req, res, next) {
//         await check(req, res, next) // проверяем существование корзины
//         try {
//             if (!req.params.productId) {
//                 throw new Error('Не указан id товара')
//             }
//             const item = await BasketDevice.create(
//                 req.signedCookies.basketId,
//                 req.params.productId,
//                 req.body
//             )
//             res.json(item)
//         } catch(e) {
//             next(APIError.badRequest(e.message))
//         }
//     }

//     async update(req, res, next) {
//         await check(req, res, next) // проверяем существование корзины
//         try {
//             if (!req.params.productId) {
//                 throw new Error('Не указан id товара')
//             }
//             const item = await BasketDevice.update(
//                 req.signedCookies.basketId,
//                 req.params.productId,
//                 req.body
//             )
//             res.json(item)
//         } catch(e) {
//             next(APIError.badRequest(e.message))
//         }
//     }

//     async delete(req, res, next) {
//         await check(req, res, next) // проверяем существование корзины
//         try {
//             if (!req.params.productId) {
//                 throw new Error('Не указан id товара')
//             }
//             const item = await BasketDevice.delete(
//                 req.signedCookies.basketId,
//                 req.params.productId,
//             )
//             res.json(item)
//         } catch(e) {
//             next(APIError.badRequest(e.message))
//         }
//     }
// }

// module.exports = new BasketDeviceControllers()
