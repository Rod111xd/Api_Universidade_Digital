const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');
const Publicacao = require('../models/publicacao');
const Tag = require('../models/tag');
const Resposta = require('../models/resposta');
const Upvote_Publicacao = require('../models/upvote_publicacao');
const Upvote_Resposta = require('../models/upvote_resposta');

const Usuario = sequelize.define('usuario', {
    nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    usuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    cargo: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    curso: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    campus: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {freezeTableName: true, tableName: 'Usuario'});


Publicacao.belongsTo(Usuario, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});
Usuario.hasMany(Publicacao, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});

Resposta.belongsTo(Usuario, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});
Usuario.hasMany(Resposta, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});

Upvote_Publicacao.belongsTo(Usuario, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});
Usuario.hasMany(Upvote_Publicacao, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});

Upvote_Resposta.belongsTo(Usuario, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});
Usuario.hasMany(Upvote_Resposta, {foreignKey: 'id_usuario', onDelete: 'CASCADE', hooks: true});

Tag.belongsToMany(Usuario, { through: 'Tag_Usuario', foreignKey: 'id_tag', otherKey: 'id_usuario', onDelete: 'CASCADE', hooks: true });
Usuario.belongsToMany(Tag, { through: 'Tag_Usuario', foreignKey: 'id_usuario', otherKey: 'id_tag', onDelete: 'CASCADE', hooks: true });


module.exports = Usuario;