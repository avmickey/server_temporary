const { Basket, BasketDevice, Device } = require('./mapping.js');
const APIError = require('../errors/APIError.js');

const pretty = (basket) => {
  const data = {};
  data.id = basket.id;
  data.devices = [];
  if (basket.devices) {
    data.devices = basket.devices.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.basketDevice.quantity,
      };
    });
  }

  return data;
};

class BasketModel {
  async getOne(basketId) {
    let basket = await Basket.findByPk(basketId, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price'] }],
    });
    if (!basket) {
      basket = await Basket.create();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async create() {
    const basket = await Basket.create();
    return pretty(basket);
  }
  // !==================================================================================================
  async append(basketId, deviceId, quantity) {
    let basket = await Basket.findByPk(basketId, {
      attributes: ['id'],
      include: [{ model: Device, attributes: ['id', 'name', 'price'] }],
    });

    if (!basket) {
      basket = await Basket.create();
    }
    // проверяем, есть ли уже этот товар в корзине
    const basketDevice = await BasketDevice.findOne({
      where: { basketId, deviceId },
    });
    if (basketDevice) {
      // есть в корзине
      await basketDevice.increment('quantity', { by: quantity });
    } else {
      // нет в корзине
      await BasketDevice.create({ basketId, deviceId, quantity });
    }
    // обновим объект корзины, чтобы вернуть свежие данные
    await basket.reload();
    return pretty(basket);
  }
  // !==================================================================================================
  async increment(basketId, deviceId, quantity) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      basket = await Basket.create();
    }
    // проверяем, есть ли этот товар в корзине
    const basketDevice = await BasketDevice.findOne({
      where: { basketId, deviceId },
    });
    if (basketDevice) {
      await basketDevice.increment('quantity', { by: quantity });
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async decrement(basketId, deviceId, quantity) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      basket = await Basket.create();
    }
    // проверяем, есть ли этот товар в корзине
    const basketDevice = await BasketDevice.findOne({
      where: { basketId, deviceId },
    });
    if (basketDevice) {
      if (basketDevice.quantity > quantity) {
        await basketDevice.decrement('quantity', { by: quantity });
      } else {
        await basketDevice.destroy();
      }
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async remove(basketId, deviceId) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      basket = await Basket.create();
    }
    // проверяем, есть ли этот товар в корзине
    const basketDevice = await BasketDevice.findOne({
      where: { basketId, deviceId },
    });
    if (basketDevice) {
      await basketDevice.destroy();
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async clear(basketId) {
    let basket = await Basket.findByPk(basketId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (basket) {
      await BasketDevice.destroy({ where: { basketId } });
      // обновим объект корзины, чтобы вернуть свежие данные
      await basket.reload();
    } else {
      basket = await Basket.create();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async delete(basketId) {
    const basket = await Basket.findByPk(basketId, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      throw new Error('Корзина не найдена в БД');
    }
    await basket.destroy();
    return pretty(basket);
  }
}

module.exports = new BasketModel();
