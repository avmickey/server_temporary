const APIError = require('../errors/APIError');
const { DeviceImg } = require('../models/mapping');
const uuid = require('uuid');
const path = require('path');

class ImageControllers {
  async set(req, res, next) {
    try {
      const { name } = req.body;
      const arr = [];
      for (const [key, value] of Object.entries(req.files)) {
        const filename = uuid.v4() + '.png';
        value.mv(path.resolve(__dirname, '..', 'static', filename));
        arr.push(filename);
      }

      if (!(arr.length != 0)) {
        return next(APIError.badRequest('не задано поле name или img'));
      }

      const image = await DeviceImg.create({ img: arr, name });
      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const image = await DeviceImg.findAll();
      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const image = await DeviceImg.destroy({ where: { id } });
      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new ImageControllers();
