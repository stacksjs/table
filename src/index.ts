import { defineCustomElement } from 'vue'
import Table from './components/TableV2.ce.vue'
import TableConfigure from './components/TableConfigure.ce.vue'

// convert into custom element constructor
const TableCustomElement = defineCustomElement(Table)
const TableConfigureCustomElement = defineCustomElement(TableConfigure)

// export individual elements
// export { TableCustomElement, TableConfigureCustomElement };

// export function register() {
customElements.define('table-v2', TableCustomElement)
customElements.define('table-configure', TableConfigureCustomElement)
// }
