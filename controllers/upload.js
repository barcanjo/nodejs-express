const fs = require('fs');

module.exports = function(app) {

    app.post('/upload/imagem', (req, res) => {
        const arquivo = req.headers.filename;
        console.log('Arquivo recebido', arquivo);

        req
            .pipe(fs.createWriteStream('files/' + arquivo))
            .on('finish', () => {
                console.log('Arquivo escrito');
                res.status(201);
            });
    });
}