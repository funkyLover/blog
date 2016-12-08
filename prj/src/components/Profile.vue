<template>
  <div class="profile">
    <img src="../assets/image/avatar.jpg" class="avatar">
    <p class="name">阿辉</p>
    <p class="bio">朴素的开始,本分的坚持,不懈的努力</p>
    <p class="contact"><i v-html="icon.github" class="icon"></i> funkyLover</p>
    <p class="contact"><i v-html="icon.linkedin" class="icon"></i>Joseph Lam</p>
    <p class="contact"><i v-html="icon.mail" class="icon"></i>ahui-lin@qq.com</p>
  </div>
</template>

<script>
import icon from 'src/assets/icon/index'

export default {
  name: 'profile',
  data () {
    return {
      icon: icon
    }
  }
}
</script>

<style lang="scss">
@import "../assets/style/common.scss";

.profile {
  width: 100%;
  padding: 10px;
}

.profile .avatar {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 6px;
}

.profile .name {
  color: $black;
  font-size: 24px;
  font-weight: 600;
}

.profile .bio {
  color: $tint-black;
  padding-bottom: 10px;
  border-bottom: 1px $gray solid;
}

.profile .contact {
  font-size: 14px;
}

.profile .contact .icon {
  float: left
}

.profile .contact .icon svg {
  fill: $light-black;
}
</style>
