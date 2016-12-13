import Vue from 'vue'
import App from 'src/App'
import VueResource from 'vue-resource'
import router from 'src/router/router'

Vue.use(VueResource)
// for cors
Vue.http.interceptors.push((request, next) => {
  if (!/https:\/\/api.github.com/.test(request.url)) {
    request.credentials = true
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
