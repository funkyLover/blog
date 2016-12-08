<template>
  <div id="app">
    <page-header></page-header>
    <div class="container">
      <div class="columns">
        <div class="column hide-md hide-sm col-md-3">
          <profile></profile>
        </div>
        <div class="column col-12 col-sm-12 col-md-9">
          <router-view></router-view>
        </div>
      </div>
    </div>
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
  font-family:  "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 115px;
}

@media (min-width: 768px) {
  #app {
    margin-top: 60px;
  }
}

/* reset primer css */
.container {
  padding: 0 10px;
  width: auto;
  max-width: 1020px;
}
/* reset css end */
</style>
