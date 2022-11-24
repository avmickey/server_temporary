const APIError = require('../errors/APIError');
const { Device, DeviceInfo, Brand, Type } = require('../models/mapping');
const uuid = require('uuid');
const path = require('path');

class DeviceControllers {
  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      page = page || 1;
      limit = limit || 10;
      let offset = page * limit - limit;
      let device;
      if (!brandId && !typeId) {
        device = await Device.findAndCountAll({
          limit,
          offset,
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
        });
      }
      if (brandId && !typeId) {
        device = await Device.findAndCountAll({
          where: { brandId },
          limit,
          offset,
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
        });
      }
      if (!brandId && typeId) {
        device = await Device.findAndCountAll({
          where: { typeId },
          limit,
          offset,
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
        });
      }
      if (brandId && typeId) {
        device = await Device.findAndCountAll({
          where: { typeId, brandId },
          limit,
          offset,
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
        });
      }
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async set(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      console.log(req.body);
      const { img } = req.files;
      const filename = uuid.v4() + '.png';
      img.mv(path.resolve(__dirname, '..', 'static', filename));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: filename,
      });
      if (info) {
        info = JSON.parse(info);
        for (const i of info) {
          await DeviceInfo.create({
            title: i.title,
            description: i.description,
            id: device.id,
          });
        }
      }

      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findOne({
        where: { id },
        include: [
          { model: DeviceInfo, as: 'info' },
          { model: Brand, as: 'brand' },
          { model: Type, as: 'type' },
        ],
      });
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Не указан id пользователя');
      }
      const device = await Device.findByPk(id);
      if (!device) {
        throw new Error('Товар не найден в БД');
      }
      await device.destroy();
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new DeviceControllers();
