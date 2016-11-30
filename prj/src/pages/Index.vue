<template>
  <div>
    <h1>index</h1>
    <hello></hello>
  </div>
</template>

<script>
import Hello from 'src/components/Hello'
import { mapActions } from 'vuex'

export default {
  name: 'index',
  mounted () {
    this.setTitle('index')
  },
  components: {
    Hello
  },
  methods: {
    ...mapActions([ 'setTitle' ])
  }
}
</script>
