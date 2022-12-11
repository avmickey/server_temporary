const APIError = require('../errors/APIError');
const { Color } = require('../models/mapping');

class ColorControllers {
  async set(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(APIError.badRequest('не задано поле name'));
      }
      const color = await Color.create({ name });
      return res.json(color);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const color = await Color.findAll();
      return res.json(color);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.pathname;
      const color = await Color.destroy({ where: { id } });
      return res.json(color);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new ColorControllers();
