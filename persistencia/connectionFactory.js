const mysql = require('mysql');

const createConnection = function() {
    return mysql.createConnection({
        host: 'localhost',
        database: 'payfast',
        user: 'root',
        password: 'password',
    });
}

module.exports = function() {
    return createConnection;
}