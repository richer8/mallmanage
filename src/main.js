// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MyHttpServer from '@/plugins/http.js'
import MyBread from '@/cuscom/myBread.vue'

import router from './router'
import '@/assets/css/index.css'

Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false
Vue.components(MyBread.name, MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
