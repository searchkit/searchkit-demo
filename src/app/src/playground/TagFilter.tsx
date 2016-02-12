import * as React from "react";

import {
SearchkitComponent,
SearchkitComponentProps,
SearchkitProvider,
SearchkitManager,
FacetAccessor,
FilterCheckboxItemComponent,
FastClick,
} from "searchkit";

export default class TagFilter extends SearchkitComponent<any, any> {

  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { field, value } = this.props
    const accessor = this.searchkit.accessors.statefulAccessors[field]
    if (!accessor) {
      console.error('Missing accessor for', field, 'in TagFilter')
      return
    }
    accessor.state = accessor.state.toggle(value)
    this.searchkit.performSearch()
  }

  render() {
    const { value } = this.props
    return (
      <FastClick handler={this.handleClick}>
        <span key={value} style={{ cursor: 'pointer', color: '#08c' }}>{this.props.children}</span>
      </FastClick>
    )
  }
}
