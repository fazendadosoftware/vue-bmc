import Vue from 'vue'
import App from './App'
import '@/assets/css/main.styl'
import '@/assets/css/tailwind.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
