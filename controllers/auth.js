const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const Tag = require('../models/tag');
const Tag_Usuario = require('../models/tag_usuario');

const signup = (req, res, next) => {
    // checks if email already exists
    return Usuario.findOne({ where : {
        [Op.or]: [{email: req.body.email}, {usuario: req.body.usuario}]
    }})
    .then(dbUsuario => {
        if (dbUsuario) {
            res.status(409).json({message: "email or user already exists"});
        } else if (req.body.email && req.body.senha) {
            // senha hash
            bcrypt.hash(req.body.senha, 12, (err, senhaHash) => {
                if (err) {
                    res.status(500).json({message: "couldnt hash the passward"}); 
                } else if (senhaHash) {
                    return Usuario.create(({
                        nome: req.body.nome,
                        senha: senhaHash,
                        usuario: req.body.usuario,
                        email: req.body.email,
                        cargo: req.body.cargo,
                        curso: req.body.curso,
                        campus: req.body.campus
                    }))
                    .then((createdUser) => {

                        return Tag_Usuario.create(({
                            id_usuario: createdUser.id,
                            id_tag: 1 // Geral
                        }))
                        .then(() => {
                            res.status(200).json({message: "user_tag created"});
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(502).json({message: "error while creating the user_tag"});
                        });

                        //res.status(200).json({message: "user created"});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({message: "error while creating the user"});
                    });
                };
            });
        } else if (!req.body.senha) {
            res.status(400).json({message: "senha not provided"});
        } else if (!req.body.email) {
            res.status(400).json({message: "email not provided"});
        };
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: err});
    });
};

const login = (req, res, next) => {
    // checks if email exists
    return Usuario.findOne({ where : {
        usuario: req.body.usuario, 
    },
    include: {
        model: Tag,
        attributes: ['id','nome'],
        required: false
    }})
    .then(dbUsuario => {
        if (!dbUsuario) {
            res.status(404).json({message: "user not found"});
        } else {
            // senha hash
            bcrypt.compare(req.body.senha, dbUsuario.senha, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user senha"});
                } else if (compareRes) { // senha match
                    dbUsuario.senha = ''
                    const token = jwt.sign({ usuario: req.body.usuario }, 'secret', { expiresIn: '1h' });
                    res.status(200).json({message: "user logged in", usuario: dbUsuario, "token": token});
                } else { // senha doesnt match
                    res.status(401).json({message: "invalid credentials"});
                };
            });
        };
    })
    .catch(err => {
        console.log('error', err);
        res.status(502).json({message: err});
    });
};

const validateAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        return res.status(401).json({ message: 'unauthorized' });
    } else {
        return res.status(200).json({ message: 'here is your resource', data: decodedToken });
    };
};

const isAuth = (req, res, next) => {
    
    var authHeader = null;

    try {
        authHeader = req.body.headers.Authorization;
    }catch {
        authHeader = req.get("Authorization");
    }

    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        return res.status(401).json({ message: 'unauthorized' });
    } else {
        return next();
    };
};

module.exports = { signup, login, isAuth, validateAuth }
