const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Upvote_Publicacao = sequelize.define('upvote_publicacao', {
    id_publicacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Publicacao',
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
}, {freezeTableName: true, tableName: 'Upvote_Publicacao'})

module.exports = Upvote_Publicacao;