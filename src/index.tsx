import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app/src/App.tsx";

import {
	SearchkitManager, SearchkitProvider
} from "searchkit";

const searchkit = new SearchkitManager("/", {multipleSearchers:false})

ReactDOM.render((
	<SearchkitProvider searchkit={searchkit}>
		<App/>
	</SearchkitProvider>
),  document.getElementById('root'))
