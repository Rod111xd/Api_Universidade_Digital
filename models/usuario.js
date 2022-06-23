const { Sequelize } = require('sequelize');

const sequelize = require('../utils/database');

const Usuario = sequelize.define('usuario', {
    nome: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    usuario: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false
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
})

module.exports = Usuario;