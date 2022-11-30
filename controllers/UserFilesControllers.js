const { User } = require('../models/mapping');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const APIError = require('../errors/APIError');

const generateJwt = (id, email, role, number, login) => {
  return jwt.sign({ id, email, role, number, login }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserFilesControllers {
  async registration(req, res, next) {
    try {
      const { email, password, number, login, role } = req.body;
      if (!email || !password) {
        return next(APIError.badRequest('Не указан email'));
      }
      const candidata = await User.findOne({ where: { email } });
      if (candidata) {
        return next(APIError.badRequest('Данный email уже существует'));
      }
      const userNumber = await User.findOne({ where: { number } });
      if (userNumber) {
        return next(APIError.badRequest('Данный номер уже существует'));
      }
      const userLogin = await User.findOne({ where: { login } });
      if (userLogin) {
        return next(APIError.badRequest('Данный логин уже существует'));
      }

      const hashPass = await bcrypt.hash(password, 5);
      const user = await User.create({
        password: hashPass,
        email,
        role,
        number,
        login,
      });
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.number,
        user.login
      );
      return res.json({ message: 'Ok', token });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ where: { email } });
      const number = await User.findOne({
        where: { number: email },
      });

      if (!user && !number) {
        return next(APIError.badRequest('логин или email не найден'));
      } else if (number) {
        user = number;
      }
      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) {
        return next(APIError.badRequest('неверный пароль'));
      }
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.number,
        user.login
      );
      return res.json({ message: 'Ok', token });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }
  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.number,
      req.user.login
    );
    return res.json({ token });
  }
}

module.exports = new UserFilesControllers();
