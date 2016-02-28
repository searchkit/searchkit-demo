# Feedback

## Sorting and SelectedFilters

By default these components don't have a `FacetContainer` like the other filters. When adding to the facet panel, it means wrapping them manually in a custom container. This doesn't work well enough for GroupedSelectedFilters, as the block title won't auto-hide when no items are present

## Facet container

Played with the FacetContainer to make it collapsable. Should the default collapsed state be true, false, or user defined ? 

Should the collapsable prop be passed from the parent component (NumericRefinementListFilter, etc.) to the FacetContainer or should a 'new' FacetContainer be made with a different default prop value ?


## Extra component props

One was to pass props would be to have like listComponent={...} and listComponentProps={...}. Not pretty and forces all components to implement the forward, but pretty straight forward.
