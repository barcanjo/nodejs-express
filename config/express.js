const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('../servicos/logger');
const morgan = require('morgan');

module.exports = function() {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(morgan('common', {
        stream: {
            write: mensagem => {
                logger.info(mensagem);
            }
        }
    }));

    consign()
        .include('persistencia')
        .include('servicos')
        .include('controllers')
        .into(app);

    return app;
}