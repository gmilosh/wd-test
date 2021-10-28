import { AxiosResponse } from 'axios';
import http from '../http-common';
import IVideoData from '../types/video.type';

export function getAll(): Promise<AxiosResponse> {
  return http.get('/files');
}

export function get(id: string): Promise<AxiosResponse> {
  return http.get(`/files/${id}`);
}

export function create(data: IVideoData): Promise<AxiosResponse> {
  return http.post('/start', data);
}
