# Feedback

## Sorting and SelectedFilters

By default these components don't have a `FacetContainer` like the other filters. When adding to the facet panel, it means wrapping them manually in a custom container. This doesn't work well enough for GroupedSelectedFilters, as the block title won't auto-hide when no items are present