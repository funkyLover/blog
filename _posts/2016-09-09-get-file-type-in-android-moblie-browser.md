---
layout: post
title: "安卓手机浏览器下获取选择文件的类型"
description: "在没有文件后缀的情况下,改如何判断文件类型"
date: 2016-09-09
tags: [webapp]
comments: true
share: true
---

最近在自己捣乱一些web app,陆陆续续踩到到不少坑,感觉自己之前遇到的问题没有意识去记录下来并加以总结,有点可惜,所以现在开始认认真真来记录一下.

这个坑本身还是有点意思的,发现这个问题是在红米2微信webview下,需求是使用input标签选择文件后得判断文件的类型,如果不符合则返回提示重新选择

```js
// 这是原版代码
fileChange (e) {
  e.preventDefault()
  // 因为使用vuejs所以用的是this.$els
  var file = this.$els.file.files[0]
  // 获取后缀
  var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
  // 我几乎选择完那部红米2下的所有图片文件
  // file.name和ext基本都是数字
  // 从fileapi能获取到信息不足以判断文件类型
  switch (ext) {
    case 'jpg':
    case 'png':
    case 'jpeg':
      this.previewImage(file)
      break
    default:
      setTimeout(function () {
        alert('请选择图片格式如png,jpg,jpeg')
      }, 1)
      _.$els.file.value = ''
      break
  }
}
```

那么问题来了

## 没有后缀的时候是通过什么来判断文件类型的?

幸运的是,我在stackoverflow上找到了这个[问题](http://stackoverflow.com/questions/30689030/html-file-input-on-chrome-for-android-missing-extension-and-mime-type)

大意就是说所有的文件都有所谓`file signatures`可以用来辨识文件类型,不过这么懒的话按上面回答的代码来改写是在太费劲了!

然后在github上找到了这个[js库](https://github.com/sindresorhus/file-type)
基于这个库改写了一下上面的代码

```js
fileChange (e) {
  e.preventDefault()
  var _ = this
  var file = _.$els.file.files[0]

  var reader = new FileReader()
  reader.onload = function (e) {
    var buf = e.target.result
    var ext = fileType(new Uint8Array(buf)).ext
    switch (ext) {
      case 'jpg':
      case 'png':
      case 'jpeg':
        _.previewImage(file)
        break
      default:
        // 这里也填了一个坑
        // 不过并没有太多资料
        // 参考http://stackoverflow.com/questions/23833840/why-cant-i-close-or-dismiss-a-javascript-alert-in-uiwebview
        setTimeout(function () {
          alert('请选择图片格式如png,jpg,jpeg')
        }, 1)
        _.$els.file.value = ''
        break
    }
  }
  reader.readAsArrayBuffer(file)
}
```
***至此~完美!***
