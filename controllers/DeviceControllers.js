const APIError = require('../errors/APIError');
const {
  Device,
  DeviceInfo,
  Brand,
  Type,
  DeviceImg,
} = require('../models/mapping');

class DeviceControllers {
  async getAllBrandOrType(req, res, next) {
    try {
      let { brandId, typeId, colorId } = req.body;
      const brand = JSON.parse(brandId || '[]');
      const arr = brand.length != 0;
      const color = JSON.parse(colorId || '[]');
      const arrColor = color.length != 0;
      let device;

      if (arr && !typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: { brandId: [...brand] },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && !typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: { brandId: [...brand], colorId: [...color] },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (!arr && typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: { typeId },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (!arr && typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: { typeId, colorId: [...color] },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: { typeId, brandId: [...brand] },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: { typeId, brandId: [...brand], colorId: [...color] },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const device = await Device.findAndCountAll({
        include: [
          { model: Brand, as: 'brand' },
          { model: Type, as: 'type' },
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });

      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async set(req, res, next) {
    try {
      let { name, price, brandId, typeId, colorId, info, deviceimgId } =
        req.body;
      const device = await Device.create({
        name,
        price,
        brandId,
        colorId,
        typeId,
        deviceimgId,
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
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
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
