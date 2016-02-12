import * as React from "react";
const BEMBlock = require("bem-cn")
const map = require("lodash/map")
const head = require("lodash/head")
const find = require("lodash/find")
import {Hits, StatefulAccessor, ValueState, SearchkitComponent} from "searchkit"
const omit = require("lodash/omit")

const ViewItemComponent = (props) => {
  return (
    <div
      className={props.bemBlock("action").state({active:props.isActive})}
      onClick={props.setView}>
      {props.view}
    </div>
  )
}

export class ViewSwitcherAccessor extends StatefulAccessor<ValueState>{
  state = new ValueState()
  options:Array<any>
  constructor(key, options){
    super(key)
    this.options = options
  }

  getSelectedOption(){
    return find(this.options, {key:this.state.getValue()}) ||
           find(this.options, {defaultOption:true}) ||
           head(this.options)
  }
}

export class ViewSwitcherHits extends SearchkitComponent<any, any> {
  accessor:ViewSwitcherAccessor
  defineAccessor(){
    return new ViewSwitcherAccessor("view", this.props.hitComponents)
  }
  render(){
    let hitComponents = this.props.hitComponents
    let props = omit(this.props, "hitComponents")
    let selectedOption = this.accessor.getSelectedOption()
    props.itemComponent = selectedOption.itemComponent
    props.mod = 'sk-hits-'+selectedOption.key
    return <Hits {...props}/>
  }
}

export class ViewSwitcher extends SearchkitComponent<any, any> {

  block:any

  constructor(props) {
    this.block = BEMBlock("grid-switcher")
    super(props)
  }
  getViewSwitcherAccessor(){
    return this.searchkit.getAccessorsByType(ViewSwitcherAccessor)[0]
  }
  changeView(view){
    let viewSwitcherAccessor = this.getViewSwitcherAccessor()
    if(view.defaultOption){
      viewSwitcherAccessor.state = viewSwitcherAccessor.state.clear()
    } else {
      viewSwitcherAccessor.state = viewSwitcherAccessor.state.setValue(view.key)
    }

    //this won't fire search as query didn't change, but it will serialize url
    //might need better way
    this.searchkit.performSearch()
    this.searchkit.emitter.trigger()
  }

  render() {
    let viewSwitcherAccessor = this.getViewSwitcherAccessor()
    if(this.hasHits() && viewSwitcherAccessor){
      let options = viewSwitcherAccessor.options
      let selectedOption = viewSwitcherAccessor.getSelectedOption()
      const actions = map(options, (option) => {
        return React.createElement(ViewItemComponent, {
          view:option.title,
          setView: ()=> this.changeView(option),
          bemBlock: this.block,
          key:option.key,
          isActive: option == selectedOption
        })
      })

      return (
      <div className={this.block()}>
        {actions}
      </div>)
    }
    return null

  }

}
