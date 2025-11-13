const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Test server is working!' }));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Test server listening on http://127.0.0.1:${PORT}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.on('listening', () => {
    const address = server.address();
    console.log('Server is now listening on:', address);
});
