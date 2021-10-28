import React, { Component, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import * as VideoService from '../services/video.service';
import IVideoData from '../types/video.type';
import * as WebSocketService from '../services/websocket.service';

type Props = Record<string, unknown>;

type State = {
  videos: Array<IVideoData>,
  title: string,
  size: string,
  clear: string,
};

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

export default class VideosListComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.retrieveVideos = this.retrieveVideos.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.saveVideo = this.saveVideo.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onUpdateProgress = this.onUpdateProgress.bind(this);

    this.state = {
      videos: [],
      title: '',
      size: '',
      clear: '',
    };
  }

  componentDidMount(): void {
    this.retrieveVideos();
    WebSocketService.init();
    WebSocketService.addListener(this.onUpdateProgress);
  }

  componentWillUnmount(): void {
    WebSocketService.removeListener();
  }

  onUpdateProgress(v: IVideoData): void {
    this.setState((prevState: State) => {
      const videos = prevState.videos.map((item) => (item.id === v.id ? v : item));
      return { videos };
    });
  }

  // upload quick & dirty
  onChangeFile(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const { name, size } = e.target.files[0];
      // console.log(name, size);
      this.setState({
        title: name,
        size: formatBytes(size),
      });
    }
  }

  refreshList(): void {
    this.retrieveVideos();
  }

  retrieveVideos(): void {
    VideoService.getAll()
      .then((response) => {
        this.setState({
          videos: response.data,
        });
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  saveVideo(): void {
    const { title, size } = this.state;
    if (!title || !size) return;

    const data: IVideoData = {
      title,
      size,
      status: 0,
      id: 0,
    };

    VideoService.create(data)
      .then((response) => {
        this.refreshList();
        this.setState({
          title: '',
          size: '',
          clear: response.data.title,
        });
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  services = [
    'Scanning',
    'Editing',
    'Preparing',
    'Finishing',
    'Done',
  ]

  render(): JSX.Element {
    const { videos, clear } = this.state;

    return (
      <div className="list row">
        <div className="col-md-12">
          <h4>
            Videos List
            <button
              type="button"
              className="m-3 btn btn-sm btn-info"
              onClick={this.refreshList}
            >
              Refresh
            </button>
          </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Size</th>
                <th scope="col">Status</th>
                <th scope="col">Progress</th>
              </tr>
            </thead>
            <tbody>
              {videos
                && videos.map((video: IVideoData) => {
                  const progress = video.progress || 0;
                  const status = this.services[video.status];
                  return (
                    <tr key={video.id}>
                      <th scope="row">
                        <Link
                          to={`/video/${video.id}`}
                        >
                          {video.title}
                        </Link>
                      </th>
                      <td>{video.size}</td>
                      <td>{status}</td>
                      <td>
                        <div className="progress" style={{ marginTop: '4px' }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${progress}%` }}
                          >
                            {progress}
                            %
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <input
            type="file"
            id="videoFile"
            name="filename"
            onChange={this.onChangeFile}
            required
            key={clear}
            multiple
          />
          <button
            type="button"
            className="m-3 btn btn-sm btn-danger"
            onClick={this.saveVideo}
          >
            Upload
          </button>
        </div>
      </div>
    );
  }
}
