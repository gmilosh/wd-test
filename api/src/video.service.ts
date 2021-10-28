import * as broker from './services/broker';
import logger from './utils/logger';
import { IVideo } from './video/video.interface';

const SERVICE_NAME: string = process.env.SERVICE_NAME || 'scan';

function doWork(e: broker.IEnvelope) {
    const payload: IVideo = JSON.parse(e.message);

    const delay = Math.floor(Math.random() * (120 - 10 + 1)) + 10;
    let counter = 0;

    // console.log(payload.id, delay)

    const progressInterval = setInterval(() => {
        counter += 1;
        const progress = Math.ceil((counter / delay) * 100);
        broker.publish(`video.${SERVICE_NAME}.progress`, {
            ...payload,
            progress,
        });
    // console.log(progress)
    }, 1000);

    setTimeout(() => {
        broker.publish(`video.${SERVICE_NAME}.finished`, { ...payload });
        // console.log(100)
        clearInterval(progressInterval);
    }, delay * 1000);
}

process.on('SIGINT', async () => {
    logger.info(`Service [${SERVICE_NAME}] is shuting down.`);
    await broker.disconnect();
    process.exit();
});

async function initService() {
    await broker.connect();
    // broker.publish(`video.${SERVICE_NAME}.online`, SERVICE_NAME)
    await broker.listen(`video.${SERVICE_NAME}.start`, doWork);
    logger.info(`Service [${SERVICE_NAME}] is listening.`);
}

initService();
