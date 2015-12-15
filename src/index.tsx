import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app/src/App.tsx";

import {SearchkitManager, history, SearchkitProvider} from "searchkit";
import { Router, Route, Link, Redirect } from 'react-router'

const searchkit = new SearchkitManager("/")

// ReactDOM.render((
// 	<Router history={history}>
// 		<Route path="/movies-app" component={SearchkitProvider.wrap(App, searchkit)}/>
// 	</Router>
// ), document.getElementById('root'))

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<App/>
	</SearchkitProvider>
),  document.getElementById('root'))
