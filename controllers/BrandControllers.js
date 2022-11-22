const APIError = require('../errors/APIError');
const { Brand } = require('../models/mapping');

class BrandConstrollers {
  async set(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(APIError.bedRequest('не задано поле name'));
      }
      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      return next(APIError.bedRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const brand = await Brand.findAll();
      return res.json(brand);
    } catch (error) {
      return next(APIError.bedRequest(error.message));
    }
  }
}

module.exports = new BrandConstrollers();
