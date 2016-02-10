import * as React from "react";

import {
RefinementListFilter, SearchkitComponentProps
} from "searchkit"


class NullComponent extends React.Component<{}, {}> {
  render(){return null}
}

export interface FacetEnablerProps extends SearchkitComponentProps {
  field: string
  operator?: string
  size?: number
  title: string
  id: string
}

export default class FacetEnabler extends React.Component<FacetEnablerProps, {}> {

  render() {
    return <RefinementListFilter {...this.props} size={0} component={NullComponent}/>
  }
}
