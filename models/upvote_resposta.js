const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Upvote_Resposta = sequelize.define('upvote_resposta', {
    id_resposta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Resposta',
            key: 'id'
        }
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {freezeTableName: true, tableName: 'Upvote_Resposta'})

module.exports = Upvote_Resposta;