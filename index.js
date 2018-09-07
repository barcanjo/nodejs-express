const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus();
const logger = require('./servicos/logger');

if (cluster.isMaster) {
    logger.info(`${cpus.length} CPU(s) encontrado(s). Criando thread para cada CPU.`);

    cpus.forEach(cpu => {
        const fork = cluster.fork();
    });

    cluster.on('listening', worker => {
        logger.info(`Cluster conectado ao processo ${worker.process.pid}`);
    });

    cluster.on('exit', worker => {
        logger.info(`Processo ${worker.process.pid} desconectado do cluster. Criando no processo...`);
        cluster.fork();
    });
} else {
    require('./server.js');
}