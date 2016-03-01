import * as React from "react";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  PageSizeAccessor,
  FastClick,
  PaginationAccessor
} from "searchkit"

import { Toggle } from '../ui'

const find = require("lodash/find")
const map = require("lodash/map")

export class PageSizeSelector extends SearchkitComponent<any, any> {

  static defaultProps = {
    listComponent: Toggle
  }

  getPageSizeAccessor(){
    return this.searchkit.getAccessorByType(PageSizeAccessor)
  }

  setSize(size){
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(size){
      let paginationAccessor = this.searchkit.getAccessorByType(PaginationAccessor)
      if(paginationAccessor){
        paginationAccessor.resetState()
      }
      pageSizeAccessor.size = size
      this.searchkit.performSearch()
    }
  }

  render() {
    let pageSizeAccessor = this.getPageSizeAccessor()
    if(pageSizeAccessor){
      let options = map(this.props.options, (option)=> {
        return {key:option, label:option}
      })
      let selectedSize = pageSizeAccessor.size

      return React.createElement(this.props.listComponent, {
        disabled: !this.hasHits(),
        items: options,
        selectedItems: [selectedSize],
        toggleItem: this.setSize.bind(this),
        urlBuilder: (item) => {}
      })
    }
    return null

  }

}
