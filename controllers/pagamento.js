const PAGAMENTO_CRIADO = 'CRIADO';
const PAGAMENTO_CONFIRMADO = 'CONFIRMADO';
const PAGAMENTO_CANCELADO = 'CANCELADO';

const logger = require('../servicos/logger');

module.exports = function(app) {
    app.post('/pagamento', (req, res) => {
        const pagamento = req.body['pagamento'];

        req.assert('pagamento.forma_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('pagamento.valor', 'Valor é obrigatório e deve ser um decimal').notEmpty().isFloat();
        req.assert('pagamento.moeda', 'Moeda é obrigatória e deve conter 3 caracteres').notEmpty().len(3, 3);

        const errors = req.validationErrors();

        if (errors) {
            logger.error('Não foi possível salvar o pagamento. Pagamento com dados inválidos!');
            res.status(400).send(errors);
            return;
        }

        const cartao = req.body['cartao'];

        const CartaoClient = new app.servicos.CartaoClient();

        CartaoClient.autorizar(cartao, (error, request, response, retorno) => {
            if (error) {
                logger.error('Não foi possível salvar o pagamento. Cartão com dados inválidos!');
                res.status(400).send(retorno);
                return;
            }

            logger.info(`Cartão ${cartao.numero} validado com sucesso!`);

            pagamento.status = PAGAMENTO_CRIADO;
            pagamento.data = new Date();
            
            const connection = app.persistencia.connectionFactory();
            const pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

            pagamentoDAO.salvar(pagamento, (err, result) => {
                if (err) {
                    logger.error('Não foi possível salvar o pagamento.');
                    res.status(500).send(err);
                    return;
                }

                pagamento.id = result.insertId;

                logger.info(`Pagamento ${pagamento.id} CRIADO sucesso`);

                const resp = {
                    dados_pagamento: pagamento,
                    cartao: retorno,
                    links: [
                      {
                        href: `http://localhost:3000/pagamento/${pagamento.id}`,
                        rel: 'confirmar',
                        method: 'PUT'
                      },
                      {
                        href: `http://localhost:3000/pagamento/${pagamento.id}`,
                        rel: 'cancelar',
                        method: 'DELETE'
                      }
                    ]
                }

                res.location('/pagamento/' + pagamento.id);
                res.status(201).json(resp);
            });
        });
    });

    app.get('/pagamento/:id', (req, res) => {
        const id = req.params.id;

        const connection = app.persistencia.connectionFactory();
        const pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.buscarPorId(id, (err, result) => {
            if (err) {
                logger.error(`Não foi possível consultar o pagaento ${id}`)
                res.status(500).send(err);
                return;
            }

            if (result.length == 0)
                logger.error(`Não foi encontrado um pagamento com ID ${id}`);

            res.json(result);
        });
    });

    app.put('/pagamento/:id', (req, res) => {
        const pagamento = {}
        const id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

        const connection = app.persistencia.connectionFactory();
        const pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.atualizar(pagamento, err => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            logger.info(`Pagamento ${pagamento.id} CONFIRMADO com sucesso`);

            res.send(pagamento);
        });
    });

    app.delete('/pagamento/:id', (req, res) => {
        const pagamento = {}
        const id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        const connection = app.persistencia.connectionFactory();
        const pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.atualizar(pagamento, err => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            logger.info(`Pagamento ${pagamento.id} CANCELADO com sucesso`);

            res.status(204).send(pagamento);
        });
    });
}