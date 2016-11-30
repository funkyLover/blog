<template>
  <div id="app">
    <h1>welcome to vue-spa</h1>
    <div class="nav">
      <router-link :to="{ name: 'index' }">index</router-link>
      <router-link :to="{ name: 'about' }">about</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from 'src/vuex/store'

export default {
  name: 'app',
  store
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
