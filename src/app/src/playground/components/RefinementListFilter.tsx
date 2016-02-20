import * as React from "react";

import {
RefinementListFilter as OriginalRefinementListFilter,
} from "searchkit";

export class RefinementListFilter extends OriginalRefinementListFilter {

  componentDidUpdate(prevProps) {
    if (prevProps.operator != this.props.operator){
      this.accessor.options.operator = this.props.operator
      this.searchkit.performSearch()
    }
  }
}
