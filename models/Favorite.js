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
  async getOne(userId) {
    const favoriteId = await Favorite.findOne({ where: { userId } });
    let favorite = await Favorite.findByPk(favoriteId.id, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price', 'img'] }],
    });

    if (!favorite) {
      favorite = await Favorite.create(userId);
    }
    return pretty(favorite);
  }
  // !==================================================================================================
  async create(userId) {
    const favorite = await Favorite.create({ userId });
    return pretty(favorite);
  }
  // !==================================================================================================
  async append(userId, deviceId) {
    const favoriteId = await Favorite.findOne({ where: { userId } });
    let favorite = await Favorite.findByPk(favoriteId.id, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price', 'img'] }],
    });
    console.log(2);
    if (!favorite) {
      favorite = await Favorite.create(userId);
    }
    const favoriteDevice = await FavoriteDevice.findOne({
      where: { favoriteId: favoriteId.id, deviceId },
    });
    console.log(1);
    console.log(favoriteDevice);
    if (favoriteDevice) {
      await FavoriteDevice.destroy({
        where: { favoriteId: favoriteId.id, deviceId },
      });
    } else {
      await FavoriteDevice.create({ favoriteId: favoriteId.id, deviceId });
    }
    await favorite.reload();
    return pretty(favorite);
  }

  // !==================================================================================================
  async delete(userId) {
    const favoriteId = await Favorite.findOne({ where: { userId } });
    const favorite = await Favorite.findByPk(favoriteId.id, {
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
