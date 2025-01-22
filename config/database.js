const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('user_management', 'root', '30sep2001@', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;