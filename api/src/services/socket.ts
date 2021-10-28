import * as WebSocket from 'ws';
import * as http from 'http';
import logger from '../utils/logger';

let ws: WebSocket;
let app: http.RequestListener;
let server: http.Server;

export function connect(_app: http.RequestListener) {
    // if (ws) return;
    if (server) return;
    if (!app) app = _app;
    server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    server.listen(8999, () => {
        logger.info('Server started on port 8999 :)');
    });
    wss.on('connection', (_ws: WebSocket) => {
        ws = _ws;
        ws.send(JSON.stringify({ message: 'Socket connection open' }));
    });
}

export function send(data: unknown) {
    if (!ws) {
        connect(app);
        return;
    }
    ws.send(JSON.stringify(data));
}
