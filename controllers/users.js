const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Usuario = require('../models/usuario');
const Tag = require('../models/tag');
const Resposta = require('../models/resposta');
const Publicacao = require('../models/publicacao');

const fetchUser = (req, res, next) => {
    
    return Usuario.findOne({ where : {
        usuario: req.query.usuario
    },
    attributes: {
        exclude: ['senha']
    },
    include: [
    {
        model: Tag,
        attributes: ['id','nome'],
        required: false
    }]
    })
    .then(dbUsuario => {
        if (dbUsuario) {
            return Resposta.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'numReplies']
                ],
                where: {
                    id_usuario: dbUsuario.id
                },
        
            })
            .then(dbReplies => {
                dbUsuario.setDataValue('numRespostas', dbReplies[0].dataValues.numReplies);
                return Publicacao.findAll({
                    attributes: [
                        
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'numPubs']
                    ],
                    where: {
                        id_usuario: dbUsuario.id
                    },
            
                })
                .then(dbPosts => {
                    dbUsuario.setDataValue('numPubs', dbPosts[0].dataValues.numPubs);
                    res.status(200).json({message: "returning user", usuario: dbUsuario});
                })
                .catch(err => {
                    console.log('error', err);
                    res.status(502).json({message: "error"});
                });
    
            }).catch(err => {
                console.log('error', err);
                res.status(502).json({message: "error"});
            });
        } else {
            res.status(404).json({message: "user does not exist"});
        }

    })
    .catch(err => {
        //console.log('error', err);
        res.status(502).json({message: err});
    });
}

const updateUser = (req, res, next) => {
    
    return Usuario.update({
        nome: req.body.nome,
        cargo: req.body.cargo,
        curso: req.body.curso,
        campus: req.body.campus 
    },
    { 
        where : {
            usuario: req.body.usuario
    },
    returning: true,
    })
    .then((result) => {
        res.status(200).json({message: "user updated", usuario: result[1][0]});
    })
    .catch(err => {
        res.status(502).json({message: err});
    });
}

module.exports = { fetchUser, updateUser }