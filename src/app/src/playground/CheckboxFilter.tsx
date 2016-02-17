import * as React from "react";

import {
SearchkitComponent,
SearchkitComponentProps,
SearchkitProvider,
SearchkitManager,
FacetAccessor,
FilterCheckboxItemComponent,
} from "searchkit";

export interface CheckboxFilterProps extends SearchkitComponentProps {
    id: string
    field: string
    value: any
    title: string
    label: string
}

export default class CheckboxFilter extends SearchkitComponent<CheckboxFilterProps, any> {
    accessor: FacetAccessor

    defineAccessor() {
        const { field, id, title, translations, value } = this.props;
        return new FacetAccessor(field, {
            id, operator: "AND", title, size: 1, translations,
            include: [value]
        })
    }

    defineBEMBlocks() {
        var blockName = "sk-refinement-list"
        return {
            container: blockName,
            option: `${blockName}-option`
        }
    }

    onToggleFilter() {
        this.accessor.state = this.accessor.state.toggle(this.props.value)
        this.searchkit.performSearch()
    }

    hasOptions() {
        return this.accessor.getBuckets().length != 0
    }

    render() {
        const { id, field, value, title, label } = this.props;

        let block = this.bemBlocks.container
        let className = block()
            .mix(`filter--${id}`)
            .state({
                disabled: !this.hasOptions()
            })

        const selected = this.accessor.state.contains(value)

        const key = value.toLowerCase();
        console.log('this.accessor.getBuckets()', this.accessor.getBuckets());
        var option = this.accessor.getBuckets().find(v => v.key === key);
        const count = option ? option.doc_count : 0;

        return (
          <div data-qa={`filter--${this.props.id}`} className={className}>
            <div data-qa="header" className={block("header") }>{title}</div>
            <div data-qa="options" className={block("options") }>
              <FilterCheckboxItemComponent
                label={label}
                count={count}
                selected={selected}
                translate={this.translate.bind(this) }
                bemBlocks={this.bemBlocks}
                toggleFilter={this.onToggleFilter.bind(this) } />
            </div>
          </div>
        )
        // field="rated" value="R" title="Movie rating" label="rated 'R'"
    }

}
