const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');
const Upvote_Resposta = require('../models/upvote_resposta');

const Resposta = sequelize.define('resposta', {
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    data_pub: {
        type: Sequelize.DATE,
        allowNull: false
    },
    upvotes: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    num_respostas: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id'
        }
    },
    id_publicacao: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Publicacao',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    id_resposta: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Resposta',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {freezeTableName: true, tableName: 'Resposta'})

Resposta.belongsTo(Resposta, {foreignKey: 'id_resposta', onDelete: 'CASCADE', hooks: true});
Resposta.hasMany(Resposta, {foreignKey: 'id_resposta', onDelete: 'CASCADE', hooks: true});

Upvote_Resposta.belongsTo(Resposta, {foreignKey: 'id_resposta', onDelete: 'CASCADE', hooks: true});
Resposta.hasMany(Upvote_Resposta, {foreignKey: 'id_resposta', onDelete: 'CASCADE', hooks: true});

module.exports = Resposta;