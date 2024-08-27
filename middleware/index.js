const jwt = require('jsonwebtoken');
module.exports = function (mongoose, utils) {
  const authenticate = {};
  const User = mongoose.model("User");
  const SessionHistory = mongoose.model("SessionHistory");

  authenticate.validateToken = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const token = authorization.split(" ");
      if (token && token.length > 0 && token?.[0] !== 'Bearer') {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      if (!token[1]) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const decoded = jwt.verify(token[1], process.env.JWT_PRIVATE_KEY);
      if (!decoded) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const user = await User.findOne({ _id: decoded._id }).lean();
      if (!user) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      if (!decoded.isMobile) {
        if (user.channelId !== decoded.channelId) {
          return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
        }
      } else {
        if (user.deviceId !== decoded.deviceId) {
          return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
        }
      }
  
      req.userInfo = user;
      return next();  
    } catch (error) {
      return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
    }
    
  };

  authenticate.checkToken = async (req, res) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const token = authorization.split(" ");
      if (token && token.length > 0 && token?.[0] !== 'Bearer') {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      if (!token[1]) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const decoded = jwt.verify(token[1], process.env.JWT_PRIVATE_KEY);
      if (!decoded) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      const user = await User.findOne({ _id: decoded._id }).lean();
      if (!user) {
        return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
      }
      if (!decoded.isMobile) {
        if (user.channelId !== decoded.channelId) {
          return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
        }
      } else {
        if (user.deviceId !== decoded.deviceId) {
          return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
        }
      }
      return utils.sendResponseNew(req, res, 'OK', 'Valid')
    } catch (error) {
      return utils.sendErrorNew(req, res, 'UNAUTHORIZED', "Unauthorized");
    }
  }
  return authenticate;
};