import {State, ArrayState, FilterBasedAccessor} from "searchkit"
import {Utils} from "searchkit"
import {
  RangeQuery,
  RangeBucket, FilterBucket, SelectedFilter, BoolShould
} from "searchkit";
const find = require("lodash/find")
const compact = require("lodash/compact")
const map = require("lodash/map")
const filter = require("lodash/filter")
const omitBy = require("lodash/omitBy")
const isUndefined = require("lodash/isUndefined")

export interface RangeOption {
  title:string, from?:number, to?:number, key?:string
}
export interface NumericOptions {
  field:string
  title:string
  options:Array<RangeOption>
  multiselect?: boolean
  id:string
}

export class NumericOptionsAccessor extends FilterBasedAccessor<ArrayState> {

  state = new ArrayState()
  options:NumericOptions
  constructor(key, options:NumericOptions){
    super(key)
    this.options = options
    this.options.options = Utils.computeOptionKeys(
      options.options, ["from", "to"], "all"
    )
  }

  getDefaultOption(){
    return find(this.options.options, it => isUndefined(it.from) && isUndefined(it.to))
  }

  getSelectedOption() {
    if (this.state.getValue().length == 0) return null
    const key = this.state.getValue()[0] // Use first key
    return find(this.options.options, { key })
  }

  getSelectedOptions() {
    return map(this.state.getValue(), key => find(this.options.options, {key}))
  }

  getSelectedOrDefaultOptions() {
    const selectedOptions = this.getSelectedOptions()
    if (selectedOptions && selectedOptions.length > 0) return selectedOptions
    const defaultOption = this.getDefaultOption()
    if (defaultOption) return [defaultOption]
    return []
  }

  // Old updated version for compatibility reasons
  setOption(facetOption){
    let option = find(this.options.options, {title:facetOption.key})
    if(option){
      if (option === this.getDefaultOption()){
        this.state = this.state.clear()
      } else {
        this.state = this.state.setValue([option.key])
      }
      this.searchkit.performSearch()
    }
  }

  toggleOption(key){
    let option = find(this.options.options, { title: key })
    if (option) {
      if (option === this.getDefaultOption()) {
        this.state = this.state.clear()
      } else if (this.options.multiselect) {
        this.state = this.state.toggle(option.key)
      } else {
        this.state = this.state.setValue([option.key])
      }
      this.searchkit.performSearch()
    }
  }

  getBuckets(){
    return filter(this.getAggregations(
      [this.key, this.key,"buckets"], []
    ), this.emptyOptionsFilter)
  }

  emptyOptionsFilter(option) {
    return option.doc_count > 0
  }

  buildSharedQuery(query) {
    var filters = this.getSelectedOptions()
    var filterRanges = map(filters, filter => RangeQuery(this.options.field, {
      gte: filter.from, lt: filter.to
    }))
    var selectedFilters: Array<SelectedFilter> = map(filters, (filter) => {
      return {
        name: this.translate(this.options.title),
        value: this.translate(filter.title),
        id: this.options.id,
        remove: () => this.state = this.state.remove(filter.key)
      }
    })

    if (filterRanges.length > 0) {
      query = query.addFilter(this.uuid, BoolShould(filterRanges))
        .addSelectedFilters(selectedFilters)
    }

    return query
  }

  getRanges() {
    return compact(map(this.options.options, (range:RangeOption) => {
      return omitBy({
        key:range.title,
        from:range.from,
        to:range.to
      }, isUndefined);
    }))
  }

  buildOwnQuery(query) {
    return query.setAggs(FilterBucket(
      this.key,
      query.getFiltersWithoutKeys(this.uuid),
      RangeBucket(
        this.key,
        this.options.field,
        this.getRanges()
      )
    ))
  }

}
