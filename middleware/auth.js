const jwt = require('jsonwebtoken');
const baseConfig = require('../config/base.config');
const response = require('../helpers/response.formatter');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(response(401, 'Token tidak ada, silakan login'));
  }

  try {
    const decoded = jwt.verify(token, baseConfig.jwt.secret);
    req.user = decoded; // data user tersimpan di req.user
    next();
  } catch (err) {
    return res.status(401).json(response(401, 'Token tidak valid atau sudah expired'));
  }
};
