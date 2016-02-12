import * as React from "react";
const BEMBlock = require("bem-cn")
const map = require("lodash/map")


export interface ViewSwitcherProps {
  active:string
  views:string[]
  onChange:Function
}

const ViewItemComponent = (props) => {
  return (
    <div
      className={props.bemBlock("action").state({active:props.isActive})}
      onClick={props.setView}>
      {props.view}
    </div>
  )
}

export class ViewSwitcher extends React.Component<ViewSwitcherProps, any> {

  block:any

  constructor(props) {
    this.block = BEMBlock("grid-switcher")
    super(props)
  }

  render() {

    const actions = map(this.props.views, (view) => {
      return React.createElement(ViewItemComponent, {
        view:view,
        setView: this.props.onChange.bind(this, view),
        bemBlock: this.block,
        key:view,
        isActive: view == this.props.active
      })
    })

    return (
    <div className={this.block()}>
      {actions}
    </div>)

  }

}
