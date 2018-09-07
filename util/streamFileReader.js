const fs = require('fs');
const arquivo = process.argv[2];

fs.createReadStream(arquivo)
.pipe(fs.createWriteStream('novo-' + arquivo))
.on('finish', () => {
    console.log('Arquivo copiado');
});