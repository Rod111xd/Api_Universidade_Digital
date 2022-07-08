const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Resposta = require('../models/resposta');
const Publicacao = require('../models/publicacao');

const createReply = (req, res, next) => {

    var d = new Date(Date.now());
    d.setHours(d.getHours() - 3); // UTC -3:00

    return Resposta.create(({
        conteudo: req.body.conteudo,
        data_pub: d.toISOString(),
        upvotes: 0,
        num_respostas: 0,
        id_usuario: req.body.id_usuario,
        id_publicacao: req.body.id_publicacao
    }))
    .then((createdReply) => {
        return Publicacao.update({ num_respostas: Sequelize.literal('num_respostas + 1') }, { where: { id: req.body.id_publicacao } })
        .then(() => {
            res.status(200).json({message: "reply created", resposta: createdReply});
        });
        
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while creating the reply"});
    });
};

const createReplyToReply = (req, res, next) => {

    var d = new Date(Date.now());
    d.setHours(d.getHours() - 3); // UTC -3:00

    return Resposta.create(({
        conteudo: req.body.conteudo,
        data_pub: d.toISOString(),
        upvotes: 0,
        num_respostas: 0,
        id_usuario: req.body.id_usuario,
        id_resposta: req.body.id_resposta
    }))
    .then((createdReply) => {
        return Resposta.update({ num_respostas: Sequelize.literal('num_respostas + 1') }, { where: { id: req.body.id_resposta } })
        .then(() => {
            return Publicacao.update({ num_respostas: Sequelize.literal('num_respostas + 1') }, { where: { id: req.body.id_publicacao } })
            .then(() => {
                res.status(200).json({message: "reply created", resposta: createdReply});
            });
        });
        
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while creating the reply"});
    });
};

const deleteReply = (req, res, next) => {

    return Resposta.destroy({
        where: { id: req.body.id_resposta }
    }).then(() => {
        return Publicacao.update({ num_respostas: Sequelize.literal('num_respostas - 1') }, { where: { id: req.body.id_publicacao } })
        .then(() => {
            res.status(200).json({message: "deleted reply"});
        });
        
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const deleteReplyToReply = (req, res, next) => {

    return Resposta.destroy({
        where: { id: req.body.id_resposta }
    }).then(() => {
        return Resposta.update({ num_respostas: Sequelize.literal('num_respostas - 1') }, { where: { id: req.body.id_resposta_pai } })
        .then(() => {
            return Publicacao.update({ num_respostas: Sequelize.literal('num_respostas - 1') }, { where: { id: req.body.id_publicacao } })
            .then(() => {
                res.status(200).json({message: "deleted reply"});
            });
        });
        
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchNumUserReplies = (req, res, next) => {

    return Resposta.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'numReplies']
        ],
        where: {
            id_usuario: req.query.id_usuario
        },

    })
    .then(dbReplies => {
        res.status(200).json({message: "returning number of replies from user", respostas: dbReplies});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

module.exports = { createReply, createReplyToReply, deleteReply, deleteReplyToReply, fetchNumUserReplies }
