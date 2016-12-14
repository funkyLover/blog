
import VueRouter from 'vue-router'
import Vue from 'vue'
import Tech from 'src/pages/Tech'
import Notes from 'src/pages/Notes'
import Chitchat from 'src/pages/Chitchat'
import About from 'src/pages/About'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'tech',
  component: Tech
}, {
  path: '/about',
  name: 'about',
  component: About
}, {
  path: '/notes',
  name: 'notes',
  component: Notes
}, {
  path: '/chitchat',
  name: 'chitchat',
  component: Chitchat
}]

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
    } else {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

var router = new VueRouter({
  mode: 'history',
  scrollBehavior,
  routes,
  linkActiveClass: 'active',
  base: '/blog/'
})

export default router
