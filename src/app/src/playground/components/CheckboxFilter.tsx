import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  FacetAccessor,
  ReactComponentType,
} from "searchkit";

import { Panel, CheckboxItemList } from '../ui'

const defaults = require('lodash/defaults')
const map = require('lodash/map')

export interface CheckboxFilterProps extends SearchkitComponentProps {
  id: string
  field: string
  value: any
  title: string
  label: string
  containerComponent?: ReactComponentType<any>
  listComponent?: ReactComponentType<any>
  collapsable?: boolean
  showCount?: boolean
}

export class CheckboxFilter extends SearchkitComponent<CheckboxFilterProps, any> {
  accessor: FacetAccessor

  static propTypes = defaults({
    field: React.PropTypes.string.isRequired,
    size: React.PropTypes.number,
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    translations: SearchkitComponent.translationsPropType(
        FacetAccessor.translations
    ),
    collapsable: React.PropTypes.bool,
    showCount: React.PropTypes.bool,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: CheckboxItemList,
    containerComponent: Panel,
    collapsable: false,
    showCount: true
  }

  constructor(props){
    super(props)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  defineAccessor() {
    const { field, id, title, translations, value } = this.props;
    return new FacetAccessor(field, {
      id, operator: "AND", title, size: 1, translations,
      include: [value]
    })
  }

  toggleFilter(key) {
    this.accessor.state = this.accessor.state.toggle(this.props.value)
    this.searchkit.performSearch()
  }

  setFilters(keys) {
    if (keys.length == 0){
      this.accessor.state = this.accessor.state.clear()
    } else {
      this.accessor.state = this.accessor.state.setValue([this.props.value])
    }
    this.searchkit.performSearch()
  }

  hasOptions() {
    return this.accessor.getBuckets().length != 0
  }

  getSelectedItems() {
    return map(this.accessor.state.getValue(), key => ({ key }))
  }

  render() {
    const { listComponent, containerComponent, showCount, title, id, collapsable, value } = this.props

    var option = this.accessor.getBuckets().find(v => v.key === value);
    const doc_count = option ? option.doc_count : 0;

    return React.createElement(containerComponent, {
      title,
      className: id ? `filter--${id}` : undefined,
      disabled: !this.hasOptions(),
      collapsable
    }, [
      React.createElement(listComponent, {
        items: [{ key: value, doc_count }],
        selectedItems: this.getSelectedItems(),
        toggleItem: this.toggleFilter,
        setItems: this.setFilters.bind(this),
        showCount
      })
    ]);
  }

}
