const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Publicacao = require('../models/publicacao');
const Usuario = require('../models/usuario');
const Tag = require('../models/tag');
const Resposta = require('../models/resposta');
const Upvote_Publicacao = require('../models/upvote_publicacao');
const Upvote_Resposta = require('../models/upvote_resposta');

const createPost = (req, res, next) => {

    var d = new Date(Date.now());
    d.setHours(d.getHours() - 3); // UTC -3:00

    return Publicacao.create(({
        conteudo: req.body.conteudo,
        data_pub: d.toISOString(),
        upvotes: 0,
        num_respostas: 0,
        id_usuario: req.body.id_usuario
    }))
    .then((createdPost) => {
        res.status(200).json({message: "post created", publicacao: createdPost});
    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while creating the post"});
    });

};

const deletePost = (req, res, next) => {

    return Publicacao.destroy({
        where: { id: req.body.id_publicacao }
    }).then(() => {
        res.status(200).json({message: "deleted post"});
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchPost = (req, res, next) => {

    return Publicacao.findOne({ where : {
        id: req.query.id_publicacao,
    },
    include: [{
        model: Usuario,
        attributes: ['id','usuario','nome','email','cargo','curso'],
        required: false
    },
    {
        model: Tag,
        attributes: ['id','nome'],
        required: false
    },
    {
        model: Resposta,
        attributes: ['id','conteudo','data_pub','upvotes','num_respostas','id_usuario','id_publicacao','createdAt'],
        required: false,
        as: 'resposta',
        include: [
            {
                model: Usuario,
                attributes: ['id','usuario','nome','email','cargo','curso'],
                required: false
            },
            {
                model: Upvote_Resposta,
                attributes: ['id','id_usuario', 'id_resposta'],
                where: {
                    id_usuario: req.query.id_usuario,
                },
                required: false
            },
            {
                model: Resposta,
                attributes: ['id','conteudo','data_pub','id_usuario','id_publicacao','createdAt'],
                required: false,
                as: 'resposta',
                include: [
                    {
                        model: Usuario,
                        attributes: ['id','usuario','nome','email','cargo','curso'],
                        required: false
                    }
                ],
            }
        ],
        order: [[{model: Resposta, as: 'resposta'}, 'createdAt', 'DESC']]
    },
    {
        model: Upvote_Publicacao,
        attributes: ['id','id_usuario', 'id_publicacao'],
        where: {
            id_usuario: req.query.id_usuario,
        },
        required: false
    }
    ],
    order: [[{model: Resposta, as: 'resposta'}, 'upvotes', 'DESC'],
            [{model: Resposta, as: 'resposta'}, 'createdAt', 'DESC']],
    })
    .then(dbPost => {
        if (dbPost) {
            res.status(200).json({message: "post exists", publicacao: dbPost});
        } else {
            res.status(404).json({message: "post does not exist"});
        }
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });

}

const fetchRecentPosts = (req, res, next) => {

    const offset = req.query.limit * (req.query.pageNumber-1);
    var id_tags = req.query.id_tags.toString();

    return Publicacao.findAll({
        include: [{
            model: Usuario,
            attributes: ['id','usuario','nome','email','cargo','curso'],
            required: false
        },
        {
            model: Tag,
            required: true
        },
        {
            model: Upvote_Publicacao,
            attributes: ['id','id_usuario', 'id_publicacao'],
            where: {
                id_usuario: req.query.id_usuario,
            },
            required: false
        }
        ],
        order: [
            ['createdAt', 'DESC']
        ],
        where: {[Op.and]: Sequelize.literal('EXISTS(SELECT * FROM "Tag_Publicacao" WHERE "Tag_Publicacao"."id_tag" IN ('+id_tags+') AND "Tag_Publicacao"."id_publicacao" = "publicacao"."id")')},
        offset: offset,
        limit: req.query.limit
    })
    .then(dbPosts => {
        res.status(200).json({message: "returning last 20 posts", publicacoes: dbPosts});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchPopularPosts = (req, res, next) => {
    const offset = req.query.limit * (req.query.pageNumber-1);
    var id_tags = req.query.id_tags.toString();

    return Publicacao.findAll({
        include: [{
            model: Usuario,
            attributes: ['id','usuario','nome','email','cargo','curso'],
            required: false
        },
        {
            model: Tag,
            required: true
        },
        {
            model: Upvote_Publicacao,
            attributes: ['id','id_usuario', 'id_publicacao'],
            where: {
                id_usuario: req.query.id_usuario,
            },
            required: false
        }
        ],
        where: {[Op.and]: Sequelize.literal('EXISTS(SELECT * FROM "Tag_Publicacao" WHERE "Tag_Publicacao"."id_tag" IN ('+id_tags+') AND "Tag_Publicacao"."id_publicacao" = "publicacao"."id")')},
        order: [
            ['upvotes', 'DESC']
        ],
        offset: offset,
        limit: req.query.limit
    })
    .then(dbPosts => {
        res.status(200).json({message: "returning last 20 most upvoted posts", publicacoes: dbPosts});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchUserPosts = (req, res, next) => {
    const offset = req.query.limit * (req.query.pageNumber-1);
    var id_tags = req.query.id_tags.toString();

    return Publicacao.findAll({
        include: [{
            model: Usuario,
            attributes: ['id','usuario','nome','email','cargo','curso'],
            required: false
        },
        {
            model: Tag,
            required: true
        },
        {
            model: Upvote_Publicacao,
            attributes: ['id','id_usuario', 'id_publicacao'],
            where: {
                id_usuario: req.query.id_usuario,
            },
            required: false
        }
        ],
        where: {
            id_usuario: req.query.id_usuario,
            [Op.and]: Sequelize.literal('EXISTS(SELECT * FROM "Tag_Publicacao" WHERE "Tag_Publicacao"."id_tag" IN ('+id_tags+') AND "Tag_Publicacao"."id_publicacao" = "publicacao"."id")')
        },
        order: [
            ['createdAt', 'DESC']
        ],
        offset: offset,
        limit: req.query.limit
    })
    .then(dbPosts => {
        res.status(200).json({message: "returning last 20 posts from user", publicacoes: dbPosts});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchNumUserPosts = (req, res, next) => {

    return Publicacao.findAll({
        attributes: [
            
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'numPubs']
        ],
        where: {
            id_usuario: req.query.id_usuario
        },

    })
    .then(dbPosts => {
        res.status(200).json({message: "returning number of posts from user", publicacoes: dbPosts});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

module.exports = { createPost, deletePost, fetchPost, fetchRecentPosts, fetchPopularPosts, fetchUserPosts, fetchNumUserPosts }
