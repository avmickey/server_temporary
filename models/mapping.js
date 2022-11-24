const { DataTypes } = require('sequelize');
const sequelize = require('../bd');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  login: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define('basketDevice', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Favorite = sequelize.define('favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const FavoriteDevice = sequelize.define('favoriteDevice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  img: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
});

const DeviceInfo = sequelize.define('deviceInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tittle: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const TypeBrand = sequelize.define('typeBrand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Basket.belongsToMany(Device, { through: BasketDevice, onDelete: 'CASCADE' });
Device.belongsToMany(Basket, { through: BasketDevice, onDelete: 'CASCADE' });

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);
Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Favorite.belongsToMany(Device, {
  through: FavoriteDevice,
  onDelete: 'CASCADE',
});
Device.belongsToMany(Favorite, {
  through: FavoriteDevice,
  onDelete: 'CASCADE',
});

Favorite.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(Favorite);
Device.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(Device);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Device,
  TypeBrand,
  Brand,
  DeviceInfo,
  Basket,
  BasketDevice,
  Type,
  Favorite,
  FavoriteDevice,
};
