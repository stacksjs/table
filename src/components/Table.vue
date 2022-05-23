<script setup lang="ts">
import { isString } from '@vueuse/core'
import { useTable } from '~/composables/table'

interface Props {
  source?: string
  password?: string
  type: string
  columns: string | string[]
  searchable?: string | boolean
  query?: string
  sortable?: string | boolean
  sort?: string // TODO: we could validate for whether :asd or :desc is used, or if not provided, default to asc (or desc?)
  sorts?: string | string[]
  filterable?: string | boolean
  filters?: string | string[]
  actionable?: string | boolean
  actions?: string | string[]
  perPage?: string | number
  selectable?: string | boolean
  // stickyHeader?: string | boolean
  // stickyFooter?: string | boolean
}

const {
  source = 'http://127.0.0.1:7700',
  password = '',
  type,
  columns,
  searchable = true,
  query,
  filters = [],
  filterable = true,
  sort = '',
  sorts = [],
  sortable = true,
  perPage = 20,
  actions = [],
  actionable = false,
  selectable = false,
} = defineProps<Props>()

const cols = computed((): string[] => {
  if (isString(columns))
    return columns.split(',').map(col => col.trim())

  return columns
})

const sortDirections = computed((): string[] => {
  if (isString(sorts))
    return sorts.split(',').map(col => col.trim())

  return sorts
})
const facetFilters = computed((): string[] => {
  if (isString(filters))
    return filters.split(',').map(col => col.trim())

  return filters
})
const itemsPerPage = computed((): number => {
  if (isString(perPage))
    return parseInt(perPage)

  return perPage
})

// let's use (init) the table by passing the default state
const { table, search, colName } = await useTable({
  source,
  password,
  type,
  columns: cols.value,
  searchable,
  query,
  filters: facetFilters.value,
  filterable,
  sort,
  sorts: sortDirections.value,
  sortable,
  actions,
  actionable,
  perPage: itemsPerPage.value,
  currentPage: 1,
  selectable,
})

// let's run the initial search upon page view/load
// eslint-disable-next-line no-console
console.log('running initial search')
const results = await search()
// eslint-disable-next-line no-console
console.log('initial search complete', results)

if (results)
  table.results = results

// now that we have the search results, let's update/set the state of the table
table.source = source
table.password = password
table.hits = results?.hits
table.type = type
table.columns = cols.value
table.searchable = searchable
table.query = query
table.filters = facetFilters.value
table.filterable = filterable
table.sort = sort
table.sorts = sortDirections.value
table.sortable = sortable
table.perPage = itemsPerPage.value
table.actions = actions
table.actionable = actionable
table.selectable = selectable
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col mt-8">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="min-w-full py-2 inline-block align-middle md:px-6 lg:px-8">
          <div class="shadow ring-black ring-1 ring-opacity-5 overflow-hidden md:rounded-lg">
            <table class="divide-y min-w-full divide-gray-300">
              <TableHead />
              <TableBody>
                <template v-for="(col, x) in cols" :key="x" #[colName(col)]="tableBodyData">
                  <!-- {{ tableBodyData }} -->
                  <slot :name="colName(col)" :value="tableBodyData.tableRowData" />
                </template>
              </TableBody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Our reset styles - many thanks to the Tailwind Labs team for gathering many of these */

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: currentColor; /* 2 */
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
*/

html {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
select {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='submit'] {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}
</style>
