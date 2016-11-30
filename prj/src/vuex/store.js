
import Vue from 'vue'
import Vuex from 'vuex'
import page from './modules/page'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
Vue.config.debug = debug

export default new Vuex.Store({
  modules: {
    page
  },
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
