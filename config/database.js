const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bnrkud01wqtdrcjuvair', 'uoi7gxmj3upv2ro2', 'gs5hYlcC2rU4XQXkfZG0', {
  host: 'bnrkud01wqtdrcjuvair-mysql.services.clever-cloud.com',
  dialect: 'mysql',
});

module.exports = sequelize;

// MYSQL_ADDON_HOST=bnrkud01wqtdrcjuvair-mysql.services.clever-cloud.com
// MYSQL_ADDON_DB=bnrkud01wqtdrcjuvair
// MYSQL_ADDON_USER=uoi7gxmj3upv2ro2
// MYSQL_ADDON_PORT=3306
// MYSQL_ADDON_PASSWORD=gs5hYlcC2rU4XQXkfZG0
// MYSQL_ADDON_URI=mysql://uoi7gxmj3upv2ro2:gs5hYlcC2rU4XQXkfZG0@bnrkud01wqtdrcjuvair-mysql.services.clever-cloud.com:3306/bnrkud01wqtdrcjuvair