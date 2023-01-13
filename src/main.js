import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'

import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./index.css";

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Row from 'primevue/row'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressBar from 'primevue/progressbar'
import SplitButton from 'primevue/splitbutton';


createApp(App)
.use(router)
.use(PrimeVue)
.use(ConfirmationService)
.component('ProgressBar', ProgressBar)
.component('Menubar', Menubar)
.component('Button', Button)
.component('DataView', DataView)
.component('DataViewLayoutOptions', DataViewLayoutOptions)
.component('Avatar', Avatar)
.component('Card', Card)
.component('Toolbar', Toolbar)
.component('InputText', InputText)
.component('Textarea', Textarea)
.component('DataTable', DataTable)
.component('Column', Column)
.component('Row', Row)
.component('ConfirmDialog', ConfirmDialog)
.component('SplitButton', SplitButton)
.mount('#app')
