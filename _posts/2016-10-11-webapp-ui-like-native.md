---
layout: post
title: "webapp仿照nativeapp交互开发-头像选择"
description: "小技巧让webapp(看起来)更接近native app"
date: 2016-10-11
tags: [webapp]
comments: true
share: true
---

原生应用在获得系统接口的权限下,可以做出体验非常好的各种交互流程,而一般而言适配了移动设配的`web app`(并不是指`hybrid app`或是用react-native或是weex搭建的`native app`)要达到原生的交互效果往往需要做更多的工作.

~~而现在的确可以说是微信的元年,公众号火自然不用说,之后的应用号出来相信web app的需求肯定会越来越多.恰好自己最近踩了一些坑特来记录,这篇权当是开篇,有可能会越写越多.~~ 应用号的形式并不是webapp

最近有需求在web app上做一个在原生应用非常常见的功能`选择头像`.

在原生应用下交互一般是这样的:

1. 点击按钮(带placeholderImage)弹出系统控件让用户选择拍照或选取已有文件
1. 用户选取或拍照完成,把placeholderImage替换成用户的图片并显示出来

其实也就是简单的两点,但要在web环境下实现还是有点难度的,下面是我的踩坑
过程(测试使用ipod touch5 ios9.3.2, 红米2 MIUI7.2.2.0, 魅族metal m1 flyme 5.1.9.0Y)

## 点击按钮选取图片文件

仿照native app,有以下几个关键点

1. 让用户点击按钮触发选择文件
1. 让用户只能选择图片文件
1. 用户选取完成之后进行预览,裁剪等操作

### 点击按钮触发选择文件

对于web环境下要选择文件,就使用`<input type='file'>`,但是请看要求`点击按钮(带placeholderImage)`,file input的样式非常固定,说实话我并不知道也没有试过能不能hack掉file input的样式和显示文字(如'请选择文件'),我采用了一种比较方便的方式

```html
<button id="avatarBtn" class="avatar-btn">
  <img src="placeholdImage" alt="请选择图片">
</button>
<input type="file" id="avatarInput" class="avatar-input">

<style>
.avatar-input {
  height: 0;
  width: 0;
  overflow: hidden;
}
</style>

<script>
$('#avatarBtn').click(function () {
  $('avatarInput').trigger('click')
})
</script>
```

基本思路就是隐藏input标签,然后通过点击按钮再去触发input的click事件,事实上这种做法在我前面提到的三个机型运行良好,我也就以为过了,谁知道后来尝试到越来越多的机型后却发现,有非常多的机型在点击按钮后并没有反应(vivo, iphone, oppe, samsung等)

当时手头并没有那么多机型可供我测试,直觉应该是`$('avatarInput').trigger('click')`不起效,上stackoverflow查到这个[问题](http://stackoverflow.com/questions/25886480/trigger-click-on-input-file),貌似就是说某些浏览器出于安全考虑不会让用户提交文件除非file input接受一个`直接`的点击.

ok,从这个要求重新出发,改写如下

```html
<div class="avatar-wrapper">
  <button id="avatarBtn" class="avatar-btn">
    <img src="placeholdImage" alt="请选择图片" id="avatarImg">
  </button>
  <input type="file" id="avatarInput" class="avatar-input">
</div>
<style>
.avatar-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
}

.avatar-wrapper .avatar-btn {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-wrapper .avatar-input {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>
```

做法就是把input设成透明然后覆盖到button的区域上,这种做法~~暂且还没有出现什么问题~~在oppo手机上出现问题了,还不清楚是其安卓版本导致还是oppo的ROM的问题

不过又改了一下,顺利能在oppo上使用

```css
.avatar-wrapper .avatar-input {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* opacity: 0; */
  clip: rect(0 0 0 0);
}

```

### 限定文件类型

这其实也是一个难点,好吧,其实也不能算是难点,因为还没开始就放弃了- -,让用户选择某一特定类型的文件,不难想到就是input标签的`accept属性`,但是请看[can i use兼容性报告](http://caniuse.com/#search=accept%20attribute%20for%20file%20input),基本安卓阵容是全挂了(我并没有测过实际情况)然后ios虽然可用,但是基于两个端行为一致的前提下当时我也并没有采用这个方案(换句话说就是我也没有试过,不知道有没有坑),

最终我选择的方案的先让用户选择文件,而后对文件类型进行识别然后提示用户的流程,稍有出入但个人觉得还在可接受范围内吧,也可以对ios用户采用`accept属性`,安卓用户则采取这套降级方案

而这部分代码和实现可以看[这里](https://github.com/funkyLover/posts/blob/master/2016/9/get-file-type-in-android-moblie-browser.md)

### 对选取图片进行预览,裁剪等操作

> 哈哈哈哈哈并没有做,因为当时没有这个需求,懒如我当然是没有去折腾,不知有没有大神搞过这块不吝指教一下.

## 把placeholderImage替换成用户的图片并显示出来

这里在一开始主要使用FileReader来实现,而[can i use](http://caniuse.com/#search=file)上面可以看出,兼容性还是蛮感人的.

```js
// html还是上面的部分
// 选择文件完成后,使用file api把文件提取出来,再使用FileReader即可
// 考虑兼容性问题,可以先上传到服务器然后显示返回的url,但是有个缺点就是
// 上传完照片后却没有进行下一步操作,这样会浪费后台资源
function previewImage (file) {
  // 代码类似
  var reader = new FileReader()
  reader.onload = function (e) {
    $('#avatarImg').attr('src', e.target.result)
  }
  reader.readAsDataURL(file)
}
```

到此为止算是基本完成这个流程
