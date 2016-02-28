import * as React from "react";

import {
  SearchkitComponent,
  SearchkitComponentProps,
  ReactComponentType
} from "searchkit"

import { FilterGroup } from '../ui'

const _ = require('lodash')

export interface GroupedSelectedFiltersProps extends SearchkitComponentProps {
  listComponent?: ReactComponentType<any>
}

export class GroupedSelectedFilters extends SearchkitComponent<GroupedSelectedFiltersProps, any> {

  static propTypes = _.defaults({
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: FilterGroup
  }

  constructor(props) {
    super(props)
    this.translate = this.translate.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.removeFilters = this.removeFilters.bind(this)
  }

  defineBEMBlocks() {
    const blockName = (this.props.mod || "sk-filter-group")
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

  removeFilter(filter) {
    filter.remove()
    this.searchkit.performSearch()
  }

  removeFilters(filters) {
    _.forEach(filters, filter => filter.remove())
    this.searchkit.performSearch()
  }

  render() {
    const { listComponent } = this.props

    if (!this.hasFilters()) {
        return null
    }

    return (
      <div className={this.bemBlocks.container() }>
        {_.map(this.getGroupedFilters(), (filters) =>
          React.createElement(listComponent, {
            title: filters[0].name,
            filters: filters,
            translate: this.translate,
            removeFilter: this.removeFilter,
            removeFilters: this.removeFilters
          })
        )}
      </div>
    )
  }
}
