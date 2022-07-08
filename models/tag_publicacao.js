const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Tag_Publicacao = sequelize.define('tag_publicacao', {
    id_tag: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Tag',
            key: 'id'
        }
    },
    id_publicacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Publicacao',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {freezeTableName: true, tableName: 'Tag_Publicacao'})

module.exports = Tag_Publicacao;