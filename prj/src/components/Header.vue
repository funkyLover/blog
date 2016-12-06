<template>
  <div class="header">
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

.header {
  background: $silver;
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  border-bottom: 1px $gray solid;
}

.logo-link {
  height: 55px;
  display: inline-block;
  padding: 12px 0;
  text-decoration: none;
  color: $black;
  font-size: 16px;
  font-weight: 600;
}

.logo-link img {
  height: 100%;
  padding-right: 5px;
}
</style>
