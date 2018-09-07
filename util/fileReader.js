const fs = require('fs');
const arquivo = process.argv[2];

fs.readFile(arquivo, (err, buffer) => {
    fs.writeFile('arquivo-texto-novo.txt', buffer, err => {
        console.log('Arquivo copiado!');
    });
});