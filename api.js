
const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require('./utils/database')
const router = require('./routes/routes')


const app = express();

app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({extended: true}));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);

sequelize.sync(); 

console.log("Ouvindo a porta: ", process.env.PORT || 80);
app.listen(process.env.PORT || 80);