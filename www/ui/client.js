import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/BrowserRouter';
import Application from './';

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  document.getElementById('container'),
);
