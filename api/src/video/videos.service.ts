/**
 * Data Model Interfaces
 */

import { IBaseVideo, IVideo } from './video.interface';
import { IVideos } from './videos.interface';

const videos: IVideos = {
    1: {
        id: 1,
        title: 'Rocket launch',
        size: '200 MB',
        status: 4,
    },
    2: {
        id: 2,
        title: 'Moon landing FX',
        size: '456 MB',
        status: 4,
    },
    3: {
        id: 3,
        title: 'Engine start',
        size: '456 MB',
        status: 4,
    },
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<IVideo[]> => Object.values(videos);

export const find = async (id: number): Promise<IVideo> => videos[id];

export const create = async (newVideo: IBaseVideo): Promise<IVideo> => {
    const id = new Date().valueOf();

    videos[id] = {
        ...newVideo,
        id,
        status: 0,
    };

    return videos[id];
};

export const updateStatus = async (id: number, status: number): Promise<IVideo | null> => {
    const video = await find(id);

    if (!video) {
        return null;
    }

    videos[id] = { ...video, status };

    return videos[id];
};

export const update = async (
    id: number,
    updatedVideo: IBaseVideo,
): Promise<IVideo | null> => {
    const video = await find(id);

    if (!video) {
        return null;
    }

    videos[id] = { id, ...updatedVideo };

    return videos[id];
};

export const remove = async (id: number): Promise<null | void> => {
    const video = await find(id);

    if (video) {
        return null;
    }

    delete videos[id];
    return video;
};
