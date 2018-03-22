---
layout: post
title: "cordova项目适配iPhoneX"
description: "iPhoneX适配踩坑浅谈"
date: 2017-11-15
tags: [front-end, cordova, meteor]
comments: true
share: true
---

Apple每次推出新尺寸的iphone都会掀起一番适配风波,这次没有下巴但有刘海的iPhoneX更是如此,网传横屏下的适配动画更是令不少人汗颜.

其实对于Native App来说,适配并不算困难(当然追求酷炫效果另算),官方文档有详细的说明,而对于Web App来说,主要还是依靠打开webview的Native App来适配,而这篇文章主要讨论的是Cordova App要如何适配iPhoneX.

> ps: 本文用到的项目模板来自[centrual/cordova-template-framework7-vue-webpack](https://github.com/centrual/cordova-template-framework7-vue-webpack)  
> 所有设配做出的改动都放到了我fork的[funkyLover/cordova-template-framework7-vue-webpack](https://github.com/funkyLover/cordova-template-framework7-vue-webpack)上

先上一开始没有适配的效果(下面截图均来自模拟器)

![iphonex1](/images/2017-11/iphonex1.png "iphone x - before")

适配后效果

![iphonex2](/images/2017-11/iphonex2.png "iphone x - after")

适配步骤如下

## 更新cordova插件

首先确认使用的cordova插件有是否包含针对iPhone X的release,例如`cordova-plugin-splashscreen`, `cordova-plugin-statusbar`等,而我是用的项目模板的插件版本刚好没有出什么问题,所以我也没有深究具体需要更新到哪些版本.

而如果使用的是Meteor来打包生成Cordova应用的话,则需要更新Meteor到1.6,而之后运行Meteor也会提醒需要更新哪些插件.

## 更新启动图

这对Native适配非常简单,就加一张图片就好了.对于Cordova也没费多大的事,修改一下`config.xml`关于ios启动图配置的部分

```xml
<platform name="ios">
  <!-- 这里只加了针对iphone x的尺寸 1125 * 2436 -->
  <splash height="2436" src="res/screen/ios/qidong.png" width="1125" />
</platform>
```

## 更新HTML viewport meta

这里的改动主要是添加`viewport-fit=cover`,其他部分可以算是Web App的标准配置了.

```xml
<meta name="viewport" content="initial-scale=1, width=device-width, height=device-height, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">
```

## 更新CSS

完成上面的配置之后,现在的显示效果应该是这样的

![iphonex3](/images/2017-11/iphonex3.png "iphone x - middle")

其实离我们的最终效果已经很近了,观察页面就大概知道是页面的顶部往上顶了,其实上面多出来的区域是iPhoneX特有的,苹果称之为安全区(看对比图三和图二的区别可以看出,上面都有所谓的安全区).

我们要做的其实就是让页面布局在安全区(`Safe Area`)之外的地方.聪明的小伙伴肯定已经想到了,对页面加个`padding-top`就可以,但是这个padding值是多少呢?肯定不会hardcode某个具体数值的.对此苹果提供了`safe-area-inset-top`和`safe-area-inset-bottom`可用于css来设定具体的安全区域.

```scss
// 前两个css规则主要用于完善framework7(模板项目使用UI库),不一定适用其他项目
html, body {
  height: 100%;
  overflow: hidden;
  // box-sizing取决于安全区的padding是加在哪个元素上
  box-sizing: border-box;
}
html.with-statusbar-overlay .framework7-root {
  padding-top: 0;
}

// 主要起效是这里,当然也不一定是加在body上
body {
  padding-top: constant(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
}
```

到这里,Cordova项目应该就已经适配好了
