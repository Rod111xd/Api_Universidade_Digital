const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Tag = require('../models/tag');
const Tag_Publicacao = require('../models/tag_publicacao');
const Tag_Usuario = require('../models/tag_usuario');

const fetchTags = (req, res, next) => {
    return Tag.findAll()
    .then(tags => {
        res.status(200).json({message: "returning tags", tags: tags});
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const addUserTags = (req, res, next) => {

    var userTags = [];
    const tags = req.body.tags;
    const initial_tags = req.body.initial_tags;
    const toAddTags = tags.filter(x => !initial_tags.includes(x))

    toAddTags.forEach((tag, i) => {
        userTags.push({ id_usuario: req.body.id_usuario, id_tag: tag });
    });
    if(!initial_tags.includes(1)) {
        userTags.push({ id_usuario: req.body.id_usuario, id_tag: 1 });
    }
    

    return Tag_Usuario.destroy({
        where: {
            id_usuario: req.body.id_usuario,
            id_tag: {[Op.notIn]:tags}
        }
    })
    .then(() => {

        return Tag_Usuario.bulkCreate(userTags)
        .then(() => {
            var toRetrieveTags = tags;
            if(!toRetrieveTags.includes(1)) {
                toRetrieveTags.push(1);
            }
            return Tag.findAll({
                where: {
                    id: {[Op.in]:toRetrieveTags}
                }
            }).then((dbTags) => {
                res.status(200).json({message: "user_tags updated", tags: dbTags});
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(502).json({message: "error while updating the user_tag"});
        });

    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while removing the user_tags"});
    });

    

};

const deleteUserTags = (req, res, next) => {

    return Tag_Usuario.destroy({
        where: { id_usuario: req.body.id_usuario, id_tag: req.body.id_tag }
    }).then(() => {
        res.status(200).json({message: "deleted user_tag"});
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchUserTags = (req, res, next) => {
    return Tag_Usuario.findAll({
        where: {
            id_usuario: req.query.id_usuario
        }
    })
    .then(userTags => {
        
        let ids = [];
        for (var i = 0; i < userTags.length; i++) {
            ids.push(userTags[i].id_tag);
        }
        
        return Tag.findAll({
            where: {
                id: ids
            }
        })
        .then(tags => {
            res.status(200).json({message: "returning tags", tags: tags});
        })
        .catch(err => {
            console.log('error', err);
            res.status(502).json({message: "error"});
        });

    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}


const addPostTags = (req, res, next) => {

    var postTags = [];
    const tags = req.body.tags;
    const initial_tags = req.body.initial_tags;
    const toAddTags = tags.filter(x => !initial_tags.includes(x))

    toAddTags.forEach((tag, i) => {
        postTags.push({ id_publicacao: req.body.id_publicacao, id_tag: tag });
    }); 

    return Tag_Publicacao.destroy({
        where: {
            id_publicacao: req.body.id_publicacao,
            id_tag: {[Op.notIn]:tags}
        }
    })
    .then(() => {

        return Tag_Publicacao.bulkCreate(postTags)
        .then(() => {
            res.status(200).json({message: "post_tags updated"});
        })
        .catch(err => {
            console.log(err);
            res.status(502).json({message: "error while updating the post_tag"});
        });

    })
    .catch(err => {
        console.log(err);
        res.status(502).json({message: "error while removing the post_tags"});
    });

};

const deletePostTags = (req, res, next) => {

    return Tag_Publicacao.destroy({
        where: { id_publicacao: req.body.id_publicacao, id_tag: req.body.id_tag }
    }).then(() => {
        res.status(200).json({message: "deleted post_tag"});
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const fetchPostTags = (req, res, next) => {
    return Tag_Publicacao.findAll({
        where: {
            id_publicacao: req.body.id_publicacao
        }
    })
    .then(postTags => {

        let ids = [];
        for (var i = 0; i < postTags.length; i++) {
            ids.push(postTags[i].id_tag);
        }

        return Tag.findAll({
            where: {
                id: ids
            }
        })
        .then(tags => {
            res.status(200).json({message: "returning tags", tags: tags});
        })
        .catch(err => {
            console.log('error', err);
            res.status(502).json({message: "error"});
        });

    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

const createTags = (req, res, next) => {
    const tags = [
        { nome: "Geral" },
        { nome: "C??lculo Diferencial e Integral I" },
        { nome: "Semin??rios em Computa????o" },
        { nome: "Matem??tica Discreta" },
        { nome: "Fundamentos de Programa????o" },
        { nome: "Circuitos Digitais" },
        { nome: "C??lculo Diferencial e Integral II" },
        { nome: "??lgebra Linear" },
        { nome: "Estruturas de Dados" },
        { nome: "Programa????o" },
        { nome: "Transmiss??o de Dados" },
        { nome: "L??gica para Ci??ncia da Computa????o" },
        { nome: "Introdu????o ?? Probabilidade e ?? Estat??stica" },
        { nome: "Algoritmos em Grafos" },
        { nome: "T??cnicas de Programa????o I" },
        { nome: "Arquitetura de Computadores" },
        { nome: "Constru????o e An??lise de Algoritmos" },
        { nome: "M??todos Num??ricos I" },
        { nome: "Computa????o Gr??fica I" },
        { nome: "Fundamentos de Bancos de Dados" },
        { nome: "Linguagens de Programa????o I" },
        { nome: "Engenharia de Software I" },
        { nome: "M??todos Num??ricos II" },
        { nome: "Redes de Computadores I" },
        { nome: "Sistemas de Gerenciamento de Bancos de Dados" },
        { nome: "Intelig??ncia Artificial" },
        { nome: "Sistemas Operacionais" },
        { nome: "An??lise e Projeto de Sistemas I" },
        { nome: "Aut??matos e Linguagens Formais" },
        { nome: "Constru????o de Compiladores" },
        { nome: "Teoria da Computa????o" },
        { nome: "Inform??tica e Sociedade" },
    ];
    
    return Tag.bulkCreate(tags
    ).then(tgs => {
        res.status(200).json({message: "Inserido tags com sucesso", tags: tgs});
    }).catch(err => {
        console.log('error', err);
        res.status(502).json({message: "error"});
    });
}

module.exports = { fetchTags, fetchUserTags, fetchPostTags, addUserTags, addPostTags, deleteUserTags, deletePostTags, createTags }
