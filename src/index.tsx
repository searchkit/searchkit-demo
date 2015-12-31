import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app/src/App.tsx";

import {
  SearchkitManager, SearchkitProvider
} from "searchkit";

const host = "https://kili-eu-west-1.searchly.com/movies/"
const sk = new SearchkitManager(host, {
  multipleSearchers:false,
  basicAuth:"read:teetndhjnrspbzxxyfxmf5fb24suqxuj"
})

ReactDOM.render((
  <SearchkitProvider searchkit={sk}>
    <App/>
  </SearchkitProvider>
),  document.getElementById('root'))
