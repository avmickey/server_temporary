const APIError = require('../errors/APIError');
const { Type } = require('../models/mapping');

class TypeControllers {
  async set(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(APIError.bedRequest('не задано поле name'));
      }
      const type = await Type.create({ name });
      return res.json(type);
    } catch (error) {
      return next(APIError.bedRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const type = await Type.findAll();
      return res.json(type);
    } catch (error) {
      return next(APIError.bedRequest(error.message));
    }
  }
}

module.exports = new TypeControllers();
