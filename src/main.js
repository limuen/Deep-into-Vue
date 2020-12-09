import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
// import store from './store'
import store from './kstore'
// import router from './router'
import router from './krouter'


Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router, // 挂载 让我们可以在插件中访问到Router的实例
  store,
  render: h => h(App),
}).$mount('#app')
