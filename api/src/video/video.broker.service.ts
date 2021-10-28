// import config from 'config';
import * as VideoService from './videos.service';
import * as broker from '../services/broker';
import { IVideo } from './video.interface';
import * as socket from '../services/socket';

// const servicesList = config.get<string[]>('services');
const servicesList = [
    'scan',
    'edit',
    'prepare',
    'finish',
];

async function onVideoMessage(e: broker.IEnvelope) {
    // console.log(e)
    // logger.info(e)
    const payload = JSON.parse(e.message);
    const key: string[] = e.key.split('.');
    const service = key[1];
    const event = key[2];
    if (event === 'progress') {
        socket.send(payload);
        return;
    }

    const video: IVideo = payload;
    const status = servicesList.indexOf(service);

    if (event === 'start') {
        await VideoService.updateStatus(video.id, status);
    } else if (event === 'finished') {
        const nextStep = status + 1;
        const updated = await VideoService.updateStatus(video.id, nextStep);
        if (nextStep < servicesList.length) {
            broker.publish(`video.${servicesList[nextStep]}.start`, updated);
        } else {
            socket.send(updated);
        }
    }
}

export async function init() {
    await broker.connect();
    await broker.listen('video.#', onVideoMessage);
}
