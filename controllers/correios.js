module.exports = function(app) {

    app.post('/correios/calcular-prazo', (req, res) => {
        const dadosEntrega = req.body;

        const correiosSOAPClient = new app.servicos.correiosSOAPClient();
        correiosSOAPClient.calcularPrazo(dadosEntrega, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(result);
        });
    });
}