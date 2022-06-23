//import { Sequelize } from 'sequelize';
const Sequelize = require('sequelize');

const sequelize = new Sequelize('DB_UniDigital', 'postgres', 'ud12345678', {
    dialect: 'postgres',
    host: 'db-uni-digital.cz5azs6hz8et.us-east-1.rds.amazonaws.com', 
});

module.exports = sequelize
//export default sequelize;