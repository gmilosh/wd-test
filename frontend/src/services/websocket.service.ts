/* eslint-disable no-console */
import IVideoData from '../types/video.type';

let ws: WebSocket;

let listener: { (a: IVideoData): void } | null;

export function init(): void {
  if (ws) return;
  ws = new WebSocket('ws://localhost:8999');
  ws.onopen = () => {
    console.log('Web socket connected');
  };
  ws.onmessage = (event: MessageEvent) => {
    const msg = JSON.parse(event.data.toString());

    if (listener && Object.prototype.hasOwnProperty.call(msg, 'id')) listener(msg as IVideoData);
    else console.log(msg);
  };
  ws.onerror = (event: Event) => {
    console.error(event.type);
  };
  ws.onclose = () => {
    console.log('Web socket connection closed');
  };
}

export function addListener(f: { (a: IVideoData): void }): void {
  listener = f;
}

export function removeListener(): void {
  listener = null;
}
