const { Device, Favorite, FavoriteDevice } = require('./mapping.js');
const APIError = require('../errors/APIError.js');

const pretty = (favorite) => {
  const data = {};
  data.id = favorite.id;
  data.devices = [];
  if (favorite.devices) {
    data.devices = favorite.devices.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
      };
    });
  }

  return data;
};

class FavoriteModel {
  async getOne(favoriteId) {
    let favorite = await Favorite.findByPk(favoriteId, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price', 'img'] }],
    });
    if (!favorite) {
      favorite = await Favorite.create();
    }
    return pretty(favorite);
  }
  // !==================================================================================================
  async create() {
    const favorite = await Favorite.create();
    return pretty(favorite);
  }
  // !==================================================================================================
  async append(favoriteId, deviceId) {
    let favorite = await Favorite.findByPk(favoriteId, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price', 'img'] }],
    });

    if (!favorite) {
      favorite = await Favorite.create();
    }
    const favoriteDevice = await FavoriteDevice.findOne({
      where: { favoriteId, deviceId },
    });
    if (favoriteDevice) {
      await FavoriteDevice.destroy({ where: { favoriteId, deviceId } });
    } else {
      await FavoriteDevice.create({ favoriteId, deviceId });
    }
    await favorite.reload();
    return pretty(favorite);
  }

  // !==================================================================================================
  async delete(favoriteId) {
    const favorite = await Favorite.findByPk(favoriteId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!favorite) {
      throw new Error('Корзина не найдена в БД');
    }
    await favorite.destroy();
    return pretty(favorite);
  }
}

module.exports = new FavoriteModel();
