<template>
  <div class="header">
    <div class="container">
      <div class="columns">
        <div class="col-md-4 col-sm-12 col-12 column text-center text-md-left">
          <router-link :to="{ name: 'tech' }" class="logo-link">
            <img src="../assets/image/icon.png" class="icon">
            <span>in da house</span>
          </router-link>
        </div>
        <div class="col-md-8 col-sm-12 col-12 column">
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

$nav-height: 55px;

.header {
  background: $silver;
  position: fixed;
  top: 0;
  width: 100%;
  height: auto;
  border-bottom: 1px $gray solid;
}

.logo-link {
  height: $nav-height;
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

ul.nav {
  list-style: none;
}

ul.nav li {
  width: 25%;
  float: left;
}

ul.nav li a {
  text-align: center;
  height: $nav-height;
  display: block;
  line-height: $nav-height;
  font-size: 18px;
  color: $light-black;
  font-weight: 600;
  position: relative;
}

ul.nav li a,
ul.nav li a::after {
  transition: all 0.2s;
}

ul.nav li a.active {
  color: $main-color;
}

ul.nav li a::after {
  content: '';
  height: 3px;
  width: 0;
  position: absolute;
  bottom: 0;
  left: 50.5%;
  transform: translate(-50%);
}

ul.nav li a.active::after,
ul.nav li a:hover::after {
  content: '';
  height: 3px;
  width: 90%;
  background: $main-color;
}

ul.nav li a:hover {
  text-decoration: none;
  color: $main-color;
}

</style>
