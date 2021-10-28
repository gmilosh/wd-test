import express from 'express';
import cors from 'cors';
// import config from 'config';
import { videoRouter } from './video/videos.router';
import { errorHandler } from './middleware/error';
import { notFoundHandler } from './middleware/not-found';

import logger from './utils/logger';

import * as videoBrokerService from './video/video.broker.service';
import * as broker from './services/broker';
import * as socket from './services/socket';

// const PORT: number = config.get<number>('port');
const PORT = 3001;

// App
const app = express();

app.use(cors());
app.use(express.json());
app.use(videoRouter);

app.use(errorHandler);
app.use(notFoundHandler);

async function init() {
    // socket
    socket.connect(app);
    // brokers
    await broker.connect();
    await videoBrokerService.init();
    logger.info('App ready');
}

app.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
    setTimeout(async () => {
        await init();
    }, 10000);
    // await init();
});

// Shutdown
process.on('SIGINT', async () => {
    logger.info('Api is shutting down.');
    await broker.disconnect();
    process.exit();
});
