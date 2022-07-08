const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Tag_Usuario = sequelize.define('tag_usuario', {
    id_tag: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Tag',
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
}, {freezeTableName: true, tableName: 'Tag_Usuario'})

module.exports = Tag_Usuario;