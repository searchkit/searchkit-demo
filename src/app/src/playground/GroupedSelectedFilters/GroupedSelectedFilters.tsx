import * as React from "react";
import './GroupedSelectedFilters.css';

import {
SearchkitManager,
SearchkitComponent,
FacetAccessor,
FastClick,
SearchkitComponentProps,
ReactComponentType,
PureRender
} from "searchkit"

const _ = require('lodash')

@PureRender
export class FilterItem extends React.Component<FilterItemProps, any> {

  render() {
    const { bemBlocks, filterId, labelKey, labelValue, removeFilter } = this.props

    return (
      <FastClick handler={removeFilter}>
        <div className={bemBlocks.option("value") }>{labelValue}</div>
      </FastClick>
    )
  }
}


function mapAndJoin(array = [], func, joinString = ", ") {
  const result = []
  const length = array.length
  array.forEach((c, idx) => {
    result.push(func(c))
    if (idx < length - 1) result.push(<span key={"joinString-" + idx}>{joinString}</span>)
  })
  return result;
}

export interface FilterItemProps {
  key: string,
  bemBlocks?: any,
  filterId: string
  labelKey: string,
  labelValue: string,
  removeFilter: Function,
  translate: Function
}

export interface SelectedFiltersProps extends SearchkitComponentProps {
  itemComponent?: ReactComponentType<FilterItemProps>
}

export default class GroupedSelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {

  static propTypes = _.defaults({
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    itemComponent: FilterItem
  }

  constructor(props) {
    super(props)
    this.translate = this.translate.bind(this)
  }

  defineBEMBlocks() {
    var blockName = (this.props.mod || "grouped-selected-filters")
    return {
      container: blockName,
      option: `${blockName}-option`
    }
  }

  getFilters(): Array<any> {
    return this.getQuery().getSelectedFilters()
  }

  getGroupedFilters(): Array<any> {
    const filters = this.getFilters();
    const groupedFilters = []
    return _.toArray(_.groupBy(filters, 'id'))
  }

  hasFilters(): boolean {
    return _.size(this.getFilters()) > 0;
  }

  renderFilter(filter) {
    return React.createElement(this.props.itemComponent, {
      key: filter.value,
      bemBlocks: this.bemBlocks,
      filterId: filter.id,
      labelKey: this.translate(filter.name),
      labelValue: this.translate(filter.value),
      removeFilter: this.removeFilter.bind(this, filter),
      translate: this.translate
    })
  }

  renderFilters(filters) {
    const { name } = filters[0]
    const className = this.bemBlocks.option()
        .mix(this.bemBlocks.container("item"))
      .mix(`selected-filter--${name}`)()
    return (
      <div key={name} className={className}>
        <FastClick handler={this.removeFilters.bind(this, filters)}>
          <div className={this.bemBlocks.option("remove-action") }>x</div>
        </FastClick>
        <div className={this.bemBlocks.option("name") }>{this.translate(name)} : </div>
        {mapAndJoin(filters, this.renderFilter.bind(this)) }
      </div>
    )
  }

  removeFilter(filter) {
    filter.remove()
    this.searchkit.performSearch()
  }

  removeFilters(filters) {
    _.forEach(filters, filter => filter.remove())
    this.searchkit.performSearch()
  }

  render() {
    if (!this.hasFilters()) {
        return null
    }
    // <div className={bemBlocks.option("remove-action") }>x</div>
    return (
      <div className={this.bemBlocks.container() }>
        {_.map(this.getGroupedFilters(), this.renderFilters.bind(this)) }
      </div>
    )
  }
}
