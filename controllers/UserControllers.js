const { User, Basket, Favorite } = require('../models/mapping');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const APIError = require('../errors/APIError');
const maxAge = 60 * 60 * 1000 * 24 * 365; // один год
const signed = true;

const generateJwt = (id, email, role, login) => {
  return jwt.sign({ id, email, role, login }, config.get('secretKey'), {
    expiresIn: '24h',
  });
};

class UserControllers {
  async registration(req, res, next) {
    try {
      const { email, password, number, login, role, firstName, lastName } =
        req.body;
      if (!email || !password) {
        return next(APIError.badRequest('Email not specified'));
      }
      const candidata = await User.findOne({ where: { email } });
      if (candidata) {
        return next(APIError.badRequest('This email already exists'));
      }
      const userNumber = await User.findOne({ where: { number } });
      if (userNumber) {
        return next(APIError.badRequest('This number already exists'));
      }
      const userLogin = await User.findOne({ where: { login } });
      if (userLogin) {
        return next(APIError.badRequest('This login already exists'));
      }

      const hashPass = await bcrypt.hash(password, 5);
      const user = await User.create({
        password: hashPass,
        email,
        role,
        number,
        login,
        firstName,
        lastName,
      });
      const basket = await Basket.create({
        userId: user.id,
      });
      const favorite = await Favorite.create({
        userId: user.id,
      });
      const token = generateJwt(user.id, user.email, user.role, user.login);
      res.cookie('userId', user.id, { maxAge, signed });
      res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ where: { email } });
      const login = await User.findOne({
        where: { login: email },
      });

      if (!user && !login) {
        return next(APIError.badRequest('login or email not found'));
      } else if (login) {
        user = login;
      }
      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) {
        return next(APIError.badRequest('Invalid password'));
      }
      const token = generateJwt(user.id, user.email, user.role, user.login);
      res.cookie('userId', user.id, { maxAge, signed });
      res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new Error('User is not found');
    }
    await user.destroy();
    return user;
  }

  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.login
    );
    const user = await User.findOne({ where: { login: req.user.login } });
    if (user) {
      res.cookie('userId', user.id, { maxAge, signed });
      res.json({ token, user });
    } else {
      return res.status(405).json({ message: 'Не авторизован' });
    }
  }
}

module.exports = new UserControllers();
