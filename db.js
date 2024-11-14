const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.HOST,
    port: process.env.PORT_BD
  }
)