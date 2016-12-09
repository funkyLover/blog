<template>
  <div class="profile">
    <img src="../assets/image/avatar.jpg" class="avatar">
    <p class="name">阿辉</p>
    <p class="bio">朴素的开始,本分的坚持,不懈的努力</p>
    <a class="contact github" href="https://github.com/funkyLover"><i v-html="icon.github" class="icon"></i> funkyLover</a>
    <a class="contact linkedin" href="https://www.linkedin.com/in/%E9%BE%99%E8%BE%89-%E6%9E%97-758307106"><i v-html="icon.linkedin" class="icon"></i>Joseph Lam</a>
    <a class="contact mail" href="mailto:ahui-lin@qq.com"><i v-html="icon.mail" class="icon"></i>ahui-lin@qq.com</a>
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
  border-bottom: 1px $gray solid;
  padding-bottom: 10px;
}

.profile .contact {
  font-size: 15px;
  display: block;
  color: $tint-black;
  margin-bottom: 8px;
  font-weight: 600;
}

.profile .contact:hover {
  text-decoration: underline;
}

.profile .contact .icon {
  float: left;
  margin-right: 5px;
}

.profile .contact .icon svg {
  fill: $tint-black;
  height: auto;
  width: 20px;
}

.profile .contact.linkedin:hover {
  color: #0176b7;
  & .icon svg {
    fill: #0176b7;
  }
}

.profile .contact.github:hover {
  color: $black;
  & .icon svg {
    fill: $black;
  }
}

.profile .contact.mail:hover {
  color: $main-color;
  & .icon svg {
    fill: $main-color;
  }
}
</style>
