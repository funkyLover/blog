---
layout: post
title: "html & css & 前端业务js"
date: 2016-12-30
tags: [front-end]
comments: true
share: true
---

##### [17-03-21]提取html字符串模板中的内容

解法来自这个[精彩回答](http://stackoverflow.com/questions/822452/strip-html-from-text-javascript#answer-822486)

```js
function strip(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
```

##### [16-11-04]去除inline-block元素直间的空隙

当一系列元素使用`display: inline-block`并排布局时,元素之间会有空隙,详情可以看[这篇文章](https://css-tricks.com/fighting-the-space-between-inline-block-elements/)  
上面文章提到的方法中,

1. 如果使用负的margin,其实是依赖于字号的尺寸既时候使用等宽字体,大部分情况下可用
1. 对父元素应用`font-size: 0`,在子元素使用`em`尺寸时会有问题,因为`em`是以父元素的font-size未基准的,另外也有提到一些额外情况(这也是我大部分会选择解决方案,目前没有遇到大问题)
1. 使用flexbox布局,主要看兼容性了

##### [16-09-09]选择文件后判断文件的类型

```js
// 这是原版代码
fileChange (e) {
  e.preventDefault()
  // 使用vuejs所以用的是this.$els
  var file = this.$els.file.files[0]
  // 获取后缀
  var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
  switch (ext) {
    // 判断文件类型
  }
}
```

上面代码在android浏览器中可能出问题,详情可以看另外[一篇文章](/2016-09-09/get-file-type-in-android-moblie-browser/)  
最后版本

```js
fileChange (e) {
  e.preventDefault()
  var _ = this
  var file = _.$els.file.files[0]
  var reader = new FileReader()
  reader.onload = function (e) {
    var buf = e.target.result
    // fileType来自https://github.com/sindresorhus/file-type
    // 基于文件的特征码来判断文件类型
    var ext = fileType(new Uint8Array(buf)).ext
    switch (ext) {
      // 判断文件
    }
  }
  reader.readAsArrayBuffer(file)
}
```

##### [16-4-12]选择文件并预览

```javascript
document.getElementById("files").onchange = function () {
    var reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("image").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
};
```


##### [16-01-28]移动端html5开发小细节

禁止标签背景  
在移动端使用 a标签做按钮的时候，点按会出现一个“暗色”的背景，去掉该背景的方法如下

```css
a, button, input, optgroup, select, textarea {
  -webkit-tap-highlight-color:rgba(0,0,0,0); /*去掉a、input和button点击时的蓝色外边框和灰色半透明背景*/
}
```

禁止长按 a，img 标签长按出现菜单栏  
使用 a标签的时候，移动端长按会出现一个 菜单栏，这个时候禁止呼出菜单栏的方法如下：

```css
a, img {
  -webkit-touch-callout: none; /*禁止长按链接与图片弹出菜单*/
}
```

流畅滚动

```css
body{
    -webkit-overflow-scrolling:touch;
}
```
