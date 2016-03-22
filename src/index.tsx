import * as ReactDOM from "react-dom";
import * as React from "react";
import {App} from "./app/src/App.tsx";
import {TaxonomyApp} from "./app/src/TaxonomyApp.tsx";
import {CrimeApp} from "./app/src/crime/CrimeApp.tsx";
import {ListApp} from "./app/src/list-app/ListApp.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={App} path="/"/>
    <Route component={App} path="imdb"/>
    <Route component={TaxonomyApp} path="taxonomy"/>
    <Route component={CrimeApp} path="crime"/>
    <Route component={ListApp} path="list-app"/>
  </Router>
), document.getElementById('root'));
