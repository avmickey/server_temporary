const FavoriteModel = require('../models/Favorite.js');
const APIError = require('../errors/APIError.js');

const maxAge = 60 * 60 * 1000 * 24 * 365;
const signed = true;

class FAvoriteControllers {
  async getOne(req, res, next) {
    try {
      let favorite;
      if (req.signedCookies.favoriteId) {
        favorite = await FavoriteModel.getOne(
          parseInt(req.signedCookies.favoriteId)
        );
      } else {
        favorite = await FavoriteModel.create();
      }
      res.cookie('favoriteId', favorite.id, { maxAge, signed });
      res.json(favorite);
    } catch (e) {
      next(APIError.badRequest(e.message));
    }
  }
  // !==================================================================================================
  async append(req, res, next) {
    try {
      let favoriteId;
      if (!req.signedCookies.favoriteId) {
        let created = await FavoriteModel.create();
        favoriteId = created.id;
      } else {
        favoriteId = parseInt(req.signedCookies.favoriteId);
      }
      const { productId } = req.params;
      const favorite = await FavoriteModel.append(favoriteId, productId);
      res.cookie('favoriteId', favorite.id, { maxAge, signed });
      res.json(favorite);
    } catch (e) {
      next(APIError.badRequest(e.message));
    }
  }

  // !==================================================================================================
  async clear(req, res, next) {
    try {
      let favoriteId;
      if (!req.signedCookies.favoriteId) {
        let created = await BasketModel.create();
        favoriteId = created.id;
      } else {
        favoriteId = parseInt(req.signedCookies.favoriteId);
      }
      const favorite = await BasketModel.clear(favoriteId);
      res.cookie('favoriteId', favorite.id, { maxAge, signed });
      res.json(favorite);
    } catch (e) {
      next(APIError.badRequest(e.message));
    }
  }
}

module.exports = new FAvoriteControllers();
