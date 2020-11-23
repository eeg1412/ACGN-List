import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import store from './store/data'
import App from './view/App'
import adminLogin from './view/admin/login'
import adminIndex from './view/admin/index'

import './assets/css/style.css';
import 'antd/dist/antd.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/admin" component={adminIndex}></Route>
        <Route exact path="/admin/login" component={adminLogin}></Route>
        <Route exact path="/admin/series" component={adminIndex}></Route>
        <Route exact path="/admin/anime" component={adminIndex}></Route>
        <Route exact path="/admin/comic" component={adminIndex}></Route>
        <Route exact path="/admin/game" component={adminIndex}></Route>
        <Route exact path="/admin/novel" component={adminIndex}></Route>
        <Route exact path="/anime" component={App}></Route>
        <Route exact path="/game" component={App}></Route>
        <Route exact path="/comic" component={App}></Route>
        <Route exact path="/novel" component={App}></Route>
        <Route path="*">
          <Redirect to="/anime" />
        </Route>
      </Switch>
    </Router>
  </Provider>,
  document.querySelector("#root")
)