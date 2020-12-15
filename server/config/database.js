const { Sequelize } = require('sequelize')
const DB = require('./key').DB

module.exports = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
	host: DB.HOST,
	logging: console.log,
	dialect: 'mysql',
	ssl: 'Amazon RDS'
})
