import * as React from "react";

import {
SearchkitComponent,
SearchkitComponentProps,
SearchkitProvider,
SearchkitManager,
FacetAccessor,
FilterCheckboxItemComponent,
} from "searchkit";

export default class TagFilter extends SearchkitComponent<any, any> {

  handleClick() {
    const { field, value } = this.props;
    const accessor = this.searchkit.accessors.statefulAccessors[field]
    accessor.state = accessor.state.toggle(value)
    this.searchkit.performSearch()
  }

  render() {
    return (
      <span onClick={this.handleClick.bind(this) } style={{ cursor: 'pointer', color: '#08c' }}>{this.props.children}</span>
    )
  }
}
