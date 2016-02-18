import * as React from "react";
import {
  SearchkitComponent,
  SearchkitComponentProps,
  ViewOptionsAccessor,
  FastClick
} from "searchkit"

import { Toggle } from '../ui'



export class ViewSwitcher extends SearchkitComponent<any, any> {

  static defaultProps = {
    listComponent: Toggle
  }

  getViewOptionsSwitcherAccessor(){
    return this.searchkit.getAccessorByType(ViewOptionsAccessor)
  }

  setView(view){
    this.getViewOptionsSwitcherAccessor().setView(view)
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
        toggleItem: this.setView.bind(this)
      })
    }
    return null

  }

}
