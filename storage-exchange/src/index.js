import "react-app-polyfill/ie11";

import "react-app-polyfill/stable";

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Router } from 'react-router-dom'
import axios from 'axios'
import history from './history'


axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 404) {
    history.push('/')
  } else if (error.response.status === 500) { 
    history.push('/')
  }
  return error
});


ReactDOM.render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root'))


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
