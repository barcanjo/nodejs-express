const soap = require('soap');

const CorreiosSOAPClient = function() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calcularPrazo = function(args, callback) {
    soap.createClient(this._url, (err, client) => {
        client.CalcPrazo(args, callback);
    });
}

module.exports = function() {
    return CorreiosSOAPClient;
}