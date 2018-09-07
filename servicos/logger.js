const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, label, printf } = format;

const customFormat = printf(message => {
    return `${message.timestamp} [${message.label}] ${message.level}: ${message.message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'Payfast' }),
        timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.File({ level: 'info', filename: 'logs/payfast.log', maxsize: 102400, maxFiles: 10, }),
    ],
});

module.exports = logger;