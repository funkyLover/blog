<template>
  <div class="title">
    <h1>you are in page {{ pageTitle }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'hello',
  computed: {
    ...mapGetters([ 'pageTitle' ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
