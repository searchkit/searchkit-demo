import * as React from "react";

import {
  SearchkitComponent,
  PaginationAccessor,
  FastClick,
  SearchkitComponentProps,
  PureRender
} from "searchkit"

const defaults = require("lodash/defaults")
const get = require("lodash/get")
const assign = require("lodash/assign")
const map = require("lodash/map")

import { Toggle } from "../ui";
import { generatePages } from "../helpers";



export interface PaginationDisplayProps {
  currentPage: number
  totalPages: number
  showNumbers?: boolean
  pageScope?: number // Number of page to show before/after the current number
  listComponent?: any
  urlBuilder: (number) => string
  translate: (string) => string
  setPage: (number) => void
}


@PureRender
export class PaginationDisplay extends React.Component<PaginationDisplayProps, any> {

  static propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    totalPages: React.PropTypes.number.isRequired,
    urlBuilder: React.PropTypes.func.isRequired,
    showNumbers: React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    setPage: React.PropTypes.func,
    listComponent: React.PropTypes.any,
  }

  static defaultProps = {
    showNumbers: false,
    pageScope: 3,
    listComponent: Toggle
  }

  getPages(){
    const { showNumbers, currentPage, totalPages, pageScope } = this.props

    const options = { showNumbers, pageScope, showLast: false }
    return generatePages(currentPage, totalPages, options);
  }

  render() {
    const { translate, setPage, listComponent, currentPage, totalPages, urlBuilder } = this.props;

    const items = map(this.getPages(), (p, idx) => {
      switch (p.type) {
        case 'ellipsis': return {
          key: 'ellipsis-' + idx,
          label: '...',
          page: undefined,
          disabled: true,
          hideInSelector: false
        }
        case 'number': return {
          key: p.page,
          label: '' + p.page,
          page: p.page,
          disabled: false,
          hideInSelector: false
        }
        case 'previous':  // continue
        case 'next': return {
          key: p.type,
          label: translate('pagination.' + p.type),
          page: p.page,
          disabled: p.disabled,
          hideInSelector: true
        }
      }
    })

    return React.createElement(listComponent, {
      items,
      selectedItems: [{ label: '' + currentPage , key:currentPage}],
      toggleItem:setPage,
      disabled: totalPages <= 1,
      urlBuilder: item => urlBuilder(item.page)
    })
  }
}


export interface PaginationProps extends SearchkitComponentProps {
  showNumbers?: boolean
  pageScope?: number // Number of page to show before/after the current number
  listComponent?: any
}

export class Pagination extends SearchkitComponent<PaginationProps, any> {
  accessor:PaginationAccessor


  static translations:any = {
    "pagination.previous":"Previous",
    "pagination.next":"Next"
  }
  translations = Pagination.translations

  static propTypes = defaults({
    translations:SearchkitComponent.translationsPropType(
      Pagination.translations
    ),
    showNumbers:React.PropTypes.bool,
    pageScope: React.PropTypes.number,
    listComponent: React.PropTypes.any,
  }, SearchkitComponent.propTypes)

  static defaultProps = {
    listComponent: Toggle
  }

  defineAccessor() {
    return new PaginationAccessor("p")
  }

  getCurrentPage():number {
    return Number(this.accessor.state.getValue()) || 1;
  }

  getTotalPages():number {
    return Math.ceil(
      get(this.getResults(), ".hits.total", 1)
      /
      get(this.getQuery(), "query.size", 10)
    );
  }

  isDisabled(pageNumber: number): boolean {
    return (pageNumber < 1) || (pageNumber > this.getTotalPages());
  }

  setPage(pageNumber:number) {
    if (this.isDisabled(pageNumber)) { return };
    if (pageNumber == this.getCurrentPage()) {
      return; // Same page, no need to rerun query
    }
    this.accessor.state = this.accessor.state.setValue(pageNumber);
    this.searchkit.performSearch();
  }

  render() {
    if (!this.hasHits()) return null;

    const { showNumbers, pageScope, listComponent } = this.props;
    return <PaginationDisplay listComponent={listComponent}
                              currentPage = { this.getCurrentPage() }
                              totalPages={this.getTotalPages()}
                              showNumbers={showNumbers}
                              pageScope={pageScope}
                              translate={this.translate.bind(this)}
                              urlBuilder={this.accessor.urlWithState}
                              setPage={this.setPage.bind(this)} />
  }
}
