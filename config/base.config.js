require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '8h',
  },
  app: {
    port: process.env.PORT || 3000,
  },
};