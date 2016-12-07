<template>
  <div id="app">
    <page-header></page-header>
    <router-view></router-view>

    <!--<div class="container">
      <div class="columns">
        <div class="one-fourth column">
          <profile></profile>
        </div>
        <div class="three-fourth column">
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import store from 'src/vuex/store'
import PageHeader from 'src/components/Header'
import Profile from 'src/components/Profile'

export default {
  name: 'app',
  store,
  components: {
    PageHeader,
    Profile
  }
}
</script>

<style lang="scss">
@import "primer-css/index.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}

/* reset primer css */
.container {
  padding: 0 10px;
  width: auto;
  max-width: 1020px;
}
/* reset css end */
</style>
