import * as React from "react";

import {
  SearchkitManager,
  SearchkitComponent,
  FacetAccessor,
  SearchkitComponentProps,
  ReactComponentType,
} from "searchkit"

import { ItemList } from '../ui'
import { RefinementListFilter} from "./RefinementListFilter"

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const concat = require("lodash/concat")

export class MenuFilter extends RefinementListFilter {

  static propTypes = defaults({
    operator: React.PropTypes.oneOf(["OR"]),
  },RefinementListFilter.propTypes)

  static defaultProps = defaults({
    listComponent: ItemList,
    operator:"OR"
  }, RefinementListFilter.defaultProps)

  toggleFilter(option) {
    if (option === "All" || this.accessor.state.contains(option)) {
      this.accessor.state = this.accessor.state.clear();
    } else {
      this.accessor.state = this.accessor.state.setValue([option]);
    }
    this.searchkit.performSearch()
  }

  getSelectedItems() {
    const values = this.accessor.state.getValue()
    if (values.length == 0) return [{ key: 'All' } ]
    return [{ key: values[0] }]
  }

  getItems(){
    const buckets = this.accessor.getBuckets()
    const allItem = { key: 'All'}
    return concat([allItem], buckets)
  }


}
