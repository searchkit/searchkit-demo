import * as React from "react";

import {
  SearchkitComponent,
  SortingAccessor,
  FastClick,
  SortingOptions,
  SearchkitComponentProps,
  SortingOption
} from "searchkit"

const defaults = require("lodash/defaults")
const map = require("lodash/map")

import { Selector } from '../ui'

export interface SortingProps extends SearchkitComponentProps {
  options:Array<SortingOption>
  listComponent?: any
}

export class Sorting extends SearchkitComponent<SortingProps, any> {
  accessor:SortingAccessor

  static propTypes = defaults({
    listComponent: React.PropTypes.any,
    options:React.PropTypes.arrayOf(
      React.PropTypes.shape({
        label:React.PropTypes.string.isRequired,
        field:React.PropTypes.string,
        order:React.PropTypes.string,
        defaultOption:React.PropTypes.bool
      })
    )
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Selector
  }

  defineAccessor() {
    return new SortingAccessor("sort", {options:this.props.options})
  }

  onSelect(key) {
    this.accessor.state = this.accessor.state.setValue(key);
    this.searchkit.performSearch();
  }

  render() {
    const { listComponent, options } = this.props
    const selected = [this.accessor.getSelectedOption().key]
    const disabled = !this.hasHits()

    return React.createElement(listComponent, {
      items: options,
      selectedItems: selected,
      toggleItem: this.onSelect.bind(this),
      disabled: disabled,
      urlBuilder: (item) => this.accessor.urlWithState(item.key)
    })
  }
}
