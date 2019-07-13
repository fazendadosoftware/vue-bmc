import Vue from 'vue'
import VueDraggable from 'vue-draggable'
import 'vue-draggable/polyfills'
import App from './App'
import '@/assets/css/main.styl'
import '@/assets/css/tailwind.css'

Vue.use(VueDraggable)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
