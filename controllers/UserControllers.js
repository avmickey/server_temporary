const { User, Basket } = require('../models/mapping');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const APIError = require('../errors/APIError');

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
      console.log(req.body);
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
      const token = generateJwt(user.id, user.email, user.role, user.login);
      return res.json({ message: 'Ok', token });
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
      return res.json({ message: 'Ok', token });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('Пользователь не найден');
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
    return res.json({ token, user });
  }
}

module.exports = new UserControllers();
