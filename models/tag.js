const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Tag = sequelize.define('tag', {
    nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    }
}, {freezeTableName: true, tableName: 'Tag', timestamps: false});

module.exports = Tag;