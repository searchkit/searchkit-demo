import * as React from "react";

import {
SearchkitManager,
SearchkitComponent,
FacetAccessor,
SearchkitComponentProps,
ReactComponentType
} from "searchkit"

import { Panel, FilterItemList } from '../ui'

const defaults = require("lodash/defaults")
const map = require("lodash/map")
const concat = require("lodash/concat")

export interface MenuFilterProps extends SearchkitComponentProps {
  field: string
  title: string
  id: string
  size?: number
  containerComponent?: ReactComponentType<any>
  itemComponent?: ReactComponentType<any>
  listComponent?: ReactComponentType<any>
  orderKey?: string
  orderDirection?: string
  include?: Array<string> | string
  exclude?: Array<string> | string
  collapsable?: boolean
  showCount?: boolean
}

export class MenuFilter extends SearchkitComponent<MenuFilterProps, any> {
  accessor: FacetAccessor

  static propTypes = defaults({
    field: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    orderKey: React.PropTypes.string,
    orderDirection: React.PropTypes.oneOf(["asc", "desc"]),
    include: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.array
    ]),
    exclude: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.array
    ]),
    collapsable: React.PropTypes.bool,
    showCount: React.PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: FilterItemList,
    containerComponent: Panel,
    collapsable: false,
    showCount: false,
    size: 50
  }

  defineAccessor() {
    const {
      field, id, size, title,
      include, exclude, orderKey, orderDirection
    } = this.props
    const operator = "OR"
    return new FacetAccessor(field, {
      id, operator, title, size, orderKey, orderDirection,
      include, exclude
    })
  }

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

  render() {
    const { listComponent, containerComponent, showCount, title, id, collapsable } = this.props

    const buckets = this.accessor.getBuckets()
    const allItem = { key: 'All'}
    const items = concat([allItem], buckets)

    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      collapsable
    }, [
        React.createElement(listComponent, {
          items,
          selectedItems: this.getSelectedItems(),
          toggleItem: this.toggleFilter.bind(this),
          showCount
        })
      ]);
  }
}
