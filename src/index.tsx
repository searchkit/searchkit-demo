import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app/src/App.tsx";

import {
  SearchkitManager, SearchkitProvider
} from "searchkit";

const host = "https://d78cfb11f565e845000.qb0x.com/movies"
const sk = new SearchkitManager(host, {
  multipleSearchers:false
})

ReactDOM.render((
  <SearchkitProvider searchkit={sk}>
    <App/>
  </SearchkitProvider>
),  document.getElementById('root'))
