import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app/src/App.tsx";

import {SearchkitManager, history, SearchkitProvider} from "searchkit";
import { Router, Route, Link, Redirect } from 'react-router'

const searchkit = new SearchkitManager("movies")


class Root extends React.Component<any, any> {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
				<App/>
			</SearchkitProvider>
		)
	}
}


ReactDOM.render((
	<Router history={history}>
		<Route path="/movies-app" component={Root}/>
	</Router>
), document.getElementById('root'))
