/* const { DataTypes } = require('sequelize')
const db = require('../config/database')

const User = require('./User')
const Plan = require('./Plan')

const UserPlans = db.define('userPlans', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    PlanId: {
        type: DataTypes.INTEGER,
        references: {
            model: Plan,
            key: 'id'
        }
    }
})
User.belongsToMany(Plan, {through: UserPlans})
Plan.belongsToMany(User, {through: UserPlans})

module.exports = UserPlans */