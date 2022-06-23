//import express from 'express';
const express = require('express');

const { signup, login, isAuth, allUsuarios } = require('../controllers/auth');

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.get('/private', isAuth);

router.get('/usuarios', allUsuarios);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

module.exports = router
//export default router;