import * as React from "react";

import {
  FastClick,
  ReactComponentType,
  PureRender
} from "searchkit"

export interface ItemComponentProps {
  bemBlocks: { container: any, option: any }
  toggleItem: Function
  translate: Function
  active: boolean
  label: string
  count: number
  showCount: boolean
}

function itemRenderer(props: ItemComponentProps, showCheckbox) {
  const {bemBlocks, toggleItem, translate, active, label, count, showCount} = props
  const block = bemBlocks.option
  const className = block()
    .state({ active })
    .mix(bemBlocks.container("item"))
  return (
    <FastClick handler={toggleItem}>
      <div className={className} data-qa="option">
        {showCheckbox ? <input type="checkbox" data-qa="checkbox" checked={active} readOnly className={block("checkbox").state({ active }) } ></input> : undefined}
        <div data-qa="label" className={block("text") }>{label}</div>
        {showCount ? < div data-qa="count" className={block("count") }>{count}</div> : undefined}
      </div>
    </FastClick>
  )
}

@PureRender
export class ItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true
  }

  render() {
    return itemRenderer(this.props, false)
  }
}

@PureRender
export class CheckboxItemComponent extends React.Component<ItemComponentProps, any>{

  static defaultProps = {
    showCount: true
  }

  render() {
    return itemRenderer(this.props, true)
  }
}
