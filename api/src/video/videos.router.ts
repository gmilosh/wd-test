/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from 'express';
import * as VideoService from './videos.service';
import { IBaseVideo, IVideo } from './video.interface';
import * as broker from '../services/broker';

/**
 * Router Definition
 */

export const videoRouter = express.Router();

/**
 * Controller Definitions
 */

// GET files

videoRouter.get('/files/', async (req: Request, res: Response) => {
    try {
        const videos: IVideo[] = await VideoService.findAll();

        res.status(200).send(videos);
    } catch (e) {
        res.status(500).send((e as Error).message);
    }
});

// GET files/:id

videoRouter.get('/files/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const video: IVideo = await VideoService.find(id);

        if (video) {
            res.status(200).send(video);
            return;
        }

        res.status(404).send('Video not found');
    } catch (e) {
        res.status(500).send((e as Error).message);
    }
});

// POST files

videoRouter.post('/start', async (req: Request, res: Response) => {
    try {
        const newVideoData: IBaseVideo = {
            ...req.body,
            status: 0,
        };

        const newVideo: IVideo = await VideoService.create(newVideoData);

        broker.publish('video.scan.start', { ...newVideo });

        res.status(201).json(newVideo);
    } catch (e) {
        res.status(500).send((e as Error).message);
    }
});

// PUT files/:id

// videoRouter.put('/files/:id', async (req: Request, res: Response) => {
//   const id: number = parseInt(req.params.id, 10);

//   try {
//     const updateData: IVideo = req.body;

//     const existingVideo: IVideo = await VideoService.find(id);

//     if (existingVideo) {
//       const updatedVideo = await VideoService.update(id, updateData);
//       return res.status(200).json(updatedVideo);
//     }

//     const newVideo = await VideoService.create(updateData);

//     res.status(201).json(newVideo);
//   } catch (e: any) {
//     res.status(500).send(e.message);
//   }
// });

// // DELETE videos/:id

// videoRouter.delete('/files/:id', async (req: Request, res: Response) => {
//   try {
//     const id: number = parseInt(req.params.id, 10);
//     await VideoService.remove(id);

//     res.sendStatus(204);
//   } catch (e: any) {
//     res.status(500).send(e.message);
//   }
// });
