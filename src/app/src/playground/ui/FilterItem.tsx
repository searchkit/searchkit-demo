import * as React from "react";

import {
  FastClick,
  ReactComponentType,
  PureRender
} from "searchkit"

export interface FilterItemComponentProps {
  bemBlocks: { container: any, option: any },
  toggleItem: Function,
  translate: Function,
  active: boolean,
  label: string,
  count: number
}

function itemRenderer(props: FilterItemComponentProps, showCheckbox) {
  const {bemBlocks, toggleItem, translate, active, label, count} = props
  const block = bemBlocks.option
  const className = block()
    .state({ active })
    .mix(bemBlocks.container("item"))
  return (
    <FastClick handler={toggleItem}>
      <div className={className} data-qa="option">
        {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input> : undefined}
        <div data-qa="label" className={block("text") }>{label}</div>
        <div data-qa="count" className={block("count") }>{count}</div>
        </div>
      </FastClick>
  )
}

@PureRender
export class FilterItemComponent extends React.Component<FilterItemComponentProps, any>{
  render() {
    return itemRenderer(this.props, false)
  }
}

@PureRender
export class FilterCheckboxItemComponent extends React.Component<FilterItemComponentProps, any>{
  render() {
    return itemRenderer(this.props, true)
  }
}
