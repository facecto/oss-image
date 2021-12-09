import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import httpRequest from './utils/httpRequest'

Vue.use(ElementUI);
Vue.prototype.$http = httpRequest
new Vue({
  el: '#app',
  render: h => h(App)
});
