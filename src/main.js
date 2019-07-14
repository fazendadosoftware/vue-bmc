import Vue from 'vue'
import VueDraggable from 'vue-draggable'
import 'vue-draggable/polyfills'
import App from './App'
import VueCloseable from './directives/vue-closeable'
import VueMarkdown from 'vue-markdown'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPen, faSlash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import '@/assets/css/main.styl'

[faPlus, faPen, faTrashAlt, faSlash].forEach(icon => library.add(icon))

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('vue-markdown', VueMarkdown)

Vue.use(VueDraggable)
Vue.use(VueCloseable)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
