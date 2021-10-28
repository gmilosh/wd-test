import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as VideoService from '../services/video.service';
import IVideoData from '../types/video.type';
import * as WebSocketService from '../services/websocket.service';

interface RouterProps {
  id: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentVideo: IVideoData;
}

export default class VideoComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.getVideo = this.getVideo.bind(this);
    this.onUpdateProgress = this.onUpdateProgress.bind(this);

    this.state = {
      currentVideo: {
        id: 0,
        title: '',
        size: '',
        status: 0,
        progress: 0,
      },
    };
  }

  componentDidMount(): void {
    // eslint-disable-next-line react/destructuring-assignment
    this.getVideo(this.props.match.params.id);
    WebSocketService.init();
    WebSocketService.addListener(this.onUpdateProgress);
  }

  componentWillUnmount(): void {
    WebSocketService.removeListener();
  }

  onUpdateProgress(v: IVideoData): void {
    const { currentVideo } = this.state;
    if (currentVideo.id !== v.id) return;
    this.setState({
      currentVideo: v,
    });
  }

  getVideo(id: string): void {
    VideoService.get(id)
      .then((response) => {
        this.setState({
          currentVideo: response.data,
        });
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
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
    const { currentVideo } = this.state;

    return (
      <div>
        {currentVideo && (
          <div>
            <h4>Video</h4>
            <div>
              <strong>Title:</strong>
              {' '}
              {currentVideo.title}
            </div>
            <div>
              <strong>Size:</strong>
              {' '}
              {currentVideo.size}
            </div>
            <div>
              <strong>Status:</strong>
              {' '}
              {this.services[currentVideo.status]}
            </div>
            {currentVideo.progress ? (
              <div className="progress" style={{ width: '200px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${currentVideo.progress}%` }}
                >
                  {currentVideo.progress}
                  %
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="m-3 btn btn-sm btn-info"
                onClick={() => 1}
              >
                Download
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}
