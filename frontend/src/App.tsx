import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import VideoComponent from './components/video.component';
import VideosListComponent from './components/video-list.component';

class App extends Component {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to="/" className="navbar-brand">
            Wonder Dynamics Test
          </Link>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={['/', '/videos']} component={VideosListComponent} />
            <Route path="/video/:id" component={VideoComponent} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
