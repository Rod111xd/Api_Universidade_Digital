//import bcrypt from 'bcryptjs';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//import jwt from 'jsonwebtoken';
const Usuario = require('../models/usuario');
//import Usuario from '../models/usuario.js';

const signup = (req, res, next) => {
    // checks if email already exists
    Usuario.findOne({ where : {
        email: req.body.email, 
    }})
    .then(dbUsuario => {
        if (dbUsuario) {
            return res.status(409).json({message: "email already exists"});
        } else if (req.body.email && req.body.senha) {
            // senha hash
            bcrypt.hash(req.body.senha, 12, (err, senhaHash) => {
                if (err) {
                    return res.status(500).json({message: "couldnt hash the senha"}); 
                } else if (senhaHash) {
                    return Usuario.create(({
                        id_usuario: 1,
                        nome: req.body.nome,
                        senha: senhaHash,
                        usuario: req.body.usuario,
                        email: req.body.email,
                        cargo: req.body.cargo,
                        curso: req.body.curso,
                        campus: req.body.campus
                    }))
                    .then(() => {
                        res.status(200).json({message: "user created"});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({message: "error while creating the user"});
                    });
                };
            });
        } else if (!req.body.senha) {
            return res.status(400).json({message: "senha not provided"});
        } else if (!req.body.email) {
            return res.status(400).json({message: "email not provided"});
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

const login = (req, res, next) => {
    // checks if email exists
    Usuario.findOne({ where : {
        usuario: req.body.usuario, 
    }})
    .then(dbUsuario => {
        if (!dbUsuario) {
            return res.status(404).json({message: "user not found"});
        } else {
            // senha hash
            bcrypt.compare(req.body.senha, dbUsuario.senha, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user senha"});
                } else if (compareRes) { // senha match
                    const token = jwt.sign({ usuario: req.body.usuario }, 'secret', { expiresIn: '1h' });
                    res.status(200).json({message: "user logged in", "token": token});
                } else { // senha doesnt match
                    res.status(401).json({message: "invalid credentials"});
                };
            });
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

const isAuth = (req, res, next) => {
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
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource', data: decodedToken });
    };
};

const allUsuarios = (req, res, next) => {
    // checks if email exists
    Usuario.findAll()
    .then(usuarios => {
        res.status(200).json({"usuarios": usuarios});
    })
    .catch(err => {
        console.log('error', err);
    });
};

module.exports = { signup, login, isAuth, allUsuarios }
