<template>
  <div>
    <h1>about</h1>
    <hello></hello>
    <div class="user" v-if="user">
      <img :src="user.avatar_url">
      <p>hello, i am {{ user.name }}</p>
      <p>github: <a :href="user.html_url">{{ user.login }}</a></p>
    </div>
  </div>
</template>

<script>
import Hello from 'src/components/Hello'
import { mapActions } from 'vuex'
import * as apis from 'src/apis/index'

export default {
  name: 'about',
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.setTitle('about')
    this.getUser()
  },
  components: {
    Hello
  },
  methods: {
    async getUser () {
      let data = await apis.get(`${apis.GET_USER_URL}/funkyLover`, {}, true)
      if (data.message) {
        // req error
        alert(data.message)
      } else {
        this.user = data
      }
    },
    ...mapActions([ 'setTitle' ])
  }
}
</script>

<style scoped>
img {
  width: 150px;
}
</style>
