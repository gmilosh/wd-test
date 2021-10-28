export interface IBaseVideo {
    title: string;
    size: string;
    status: number;
}

export interface IVideo extends IBaseVideo {
    id: number;
}
