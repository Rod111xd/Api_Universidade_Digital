const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');
const Tag = require('../models/tag');
const Resposta = require('../models/resposta');
const Upvote_Publicacao = require('../models/upvote_publicacao');

const Publicacao = sequelize.define('publicacao', {
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
        },
        onDelete: 'CASCADE'
    }
}, {freezeTableName: true, tableName: 'Publicacao'});

Resposta.belongsTo(Publicacao, {foreignKey: 'id_publicacao', onDelete: 'CASCADE', hooks: true});
Publicacao.hasMany(Resposta, {foreignKey: 'id_publicacao', onDelete: 'CASCADE', hooks: true});

Upvote_Publicacao.belongsTo(Publicacao, {foreignKey: 'id_publicacao', onDelete: 'CASCADE', hooks: true});
Publicacao.hasMany(Upvote_Publicacao, {foreignKey: 'id_publicacao', onDelete: 'CASCADE', hooks: true});

Tag.belongsToMany(Publicacao, { through: 'Tag_Publicacao', foreignKey: 'id_tag', otherKey: 'id_publicacao', onDelete: 'CASCADE', hooks: true });
Publicacao.belongsToMany(Tag, { through: 'Tag_Publicacao', foreignKey: 'id_publicacao', otherKey: 'id_tag', onDelete: 'CASCADE', hooks: true });

module.exports = Publicacao;