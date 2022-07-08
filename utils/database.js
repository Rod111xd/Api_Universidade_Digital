
const Sequelize = require('sequelize');

const sequelize = new Sequelize('DB_UniDigital', 'postgres', 'ud12345678', {
    dialect: 'postgres',
    host: 'db-uni-digital.cz5azs6hz8et.us-east-1.rds.amazonaws.com',
    timestamps: false,
    dialectOptions:{
        useUTC:false,
        dateStrings: true,
        typeCast: function (field, next) { 
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        }
    },
    timezone: "-03:00"
});

module.exports = sequelize
