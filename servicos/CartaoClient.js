const restify = require('restify-clients');

const CartaoClient = function() {
    this._client = restify.createJsonClient({
        url: 'http://localhost:3000',
        version: '~1.0',
    });
}


CartaoClient.prototype.autorizar = function(cartao, callback) {
    console.log('Solicitando autorizacao de cartao');
    this._client.post('/cartao/autorizar', cartao, callback);
}

module.exports = function() {
    return CartaoClient;
}