const server = require('./config/express')();
const port = 3000;

server.listen(port, () => {
    console.log('Server running on port', port);
});