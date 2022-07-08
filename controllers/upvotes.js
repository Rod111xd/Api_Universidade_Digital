const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Upvote_Publicacao = require('../models/upvote_publicacao');
const Upvote_Resposta = require('../models/upvote_resposta');
const Publicacao = require('../models/publicacao');
const Resposta = require('../models/resposta');

const addPostUpvote = (req, res, next) => {
    
    return Upvote_Publicacao.create(({
        id_usuario: req.body.id_usuario,
        id_publicacao: req.body.id_publicacao
    }))
    .then(() => {
        return Publicacao.update({ upvotes: Sequelize.literal('upvotes + 1') }, { where: { id: req.body.id_publicacao } })
        .then(() => {
            res.status(200).json({message: "upvoted post"});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while upvoting the post"});
    });

};

const removePostUpvote = (req, res, next) => {
    
    return Upvote_Publicacao.destroy({
        where: { 
            id_usuario: req.body.id_usuario,
            id_publicacao: req.body.id_publicacao
        }
    }).then(() => {
        return Publicacao.update({ upvotes: Sequelize.literal('upvotes - 1') }, { where: { id: req.body.id_publicacao } })
        .then(() => {
            res.status(200).json({message: "deleted upvote"});
        });
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });

};

const addReplyUpvote = (req, res, next) => {
    
    return Upvote_Resposta.create(({
        id_usuario: req.body.id_usuario,
        id_resposta: req.body.id_resposta
    }))
    .then(() => {
        return Resposta.update({ upvotes: Sequelize.literal('upvotes + 1') }, { where: { id: req.body.id_resposta } })
        .then(() => {
            res.status(200).json({message: "upvoted reply"});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while upvoting the reply"});
    });

};

const removeReplyUpvote = (req, res, next) => {

    return Upvote_Resposta.destroy({
        where: { 
            id_usuario: req.body.id_usuario,
            id_resposta: req.body.id_resposta
        }
    }).then(() => {
        return Resposta.update({ upvotes: Sequelize.literal('upvotes - 1') }, { where: { id: req.body.id_resposta } })
        .then(() => {
            res.status(200).json({message: "deleted upvote"});
        });
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });

}


module.exports = { addPostUpvote, addReplyUpvote, removePostUpvote, removeReplyUpvote }
