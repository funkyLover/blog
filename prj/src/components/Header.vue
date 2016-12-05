<template>
  <div class="header position-fixed">
    <div class="container">
      <div class="columns">
        <div class="one-fourth column">
          <router-link :to="{ name: 'tech' }" class="logo-link">
            <img src="../assets/image/icon.png" class="icon">
            <span>in da house</span>
          </router-link>
        </div>
        <div class="three-fourths column">
          <ul class="nav list-style-none">
            <li>
              <router-link :to="{ name: 'tech' }">Tech</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'notes' }">Notes</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'chitchat' }">Chitchat</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'about' }">About</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header'
}
</script>

<style lang="scss" scoped>
@import '../assets/style/common.scss';

</style>
