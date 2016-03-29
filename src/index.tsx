import * as ReactDOM from "react-dom";
import * as React from "react";
import {App} from "./app/src/App.tsx";
import {TaxonomyApp} from "./app/src/TaxonomyApp.tsx";
import {CrimeApp} from "./app/src/crime/CrimeApp.tsx";
import {Demo1} from "./demo/demo1.tsx"
import {Demo2} from "./demo/demo2.tsx";
import {ListApp} from "./app/src/list-app/ListApp.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={App} path="/"/>
    <Route component={App} path="imdb"/>
    <Route component={TaxonomyApp} path="taxonomy"/>
    <Route component={CrimeApp} path="crime"/>

    <Route component={Demo1} path="demo/demo1"/>
    <Route component={Demo2} path="demo/demo2"/>

    <Route component={ListApp} path="list-app"/>
  </Router>
), document.getElementById('root'));
