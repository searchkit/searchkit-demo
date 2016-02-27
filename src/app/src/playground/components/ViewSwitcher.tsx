import * as React from "react";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  ViewOptionsAccessor,
  FastClick
} from "searchkit"

import { Toggle } from '../ui'

const find = require("lodash/find")

export class ViewSwitcher extends SearchkitComponent<any, any> {

  static defaultProps = {
    listComponent: Toggle
  }

  getViewOptionsSwitcherAccessor(){
    return this.searchkit.getAccessorByType(ViewOptionsAccessor)
  }

  setView(key){
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    let view = find(viewOptionsAccessor.options, {key})
    viewOptionsAccessor.setView(view)
  }

  render() {
    let viewOptionsAccessor = this.getViewOptionsSwitcherAccessor()
    if(viewOptionsAccessor){
      let options = viewOptionsAccessor.options
      let selectedOption = viewOptionsAccessor.getSelectedOption()

      return React.createElement(this.props.listComponent, {
        disabled: !this.hasHits(),
        items: options,
        selectedItems: [selectedOption],
        toggleItem: this.setView.bind(this),
        setItems: ([item]) => this.setView(item),
        urlBuilder: (item) => this.getViewOptionsSwitcherAccessor().urlWithState(item.key)
      })
    }
    return null

  }

}
