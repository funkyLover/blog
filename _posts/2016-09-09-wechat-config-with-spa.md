---
layout: post
title: "对于url变化的spa应该如何使用微信jssdk"
description: "使用vue,vue-router,vuex,vuex-router-sync构建spa时,在微信下踩的一点坑,至今没填平"
date: 2016-09-09
tags: [wechat]
comments: true
share: true
---

使用的是`vue`,`vue-router`,`vuex`,`vuex-router-sync`来搭建spa,用于微信生态下传播需要使用到微信jssdk,踩了不少坑,记得多少记录多少吧.

乍一看微信jssdk的文档好像非常详细,但其实坑还是蛮多的(或许是我的理解力有问题吧)

其实配置完成后基本条用都不会有什么问题,但问题在于**如何完成配置(wx.config)**对于spa而言,文档中几句比较重要的

> 同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
> 目前Android微信客户端不支持pushState的H5新特性，所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复
> erro接口: config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

## 何时config,怎么config

这个`变化url的SPA`我至今没搞明白是什么意思,像用`react-router`或者`vue-router`搭建的spa需不需要在每个路由下进行调用呢?实际上一开始我也的确是在url发生变化是进行调用,但是使用[微信开发者工具](https://mp.weixin.qq.com/wiki/10/e5f772f4521da17fa0d7304f68b97d7e.html)进行调试时却发现调用其他接口时失败了,所以后来换成不重新配置直接条用接口发现在开发者工具上正常,到实际设配上使用又懵逼了...

之后陆陆续续又尝试了非常多种组合,其中还牵扯到需不需要再向服务器重新拉取配置信息

最终使用的伪代码如下

```js
function configWX () {
  if (wechat.configData) {
    // 这里不去重新请求config数据
    // 因为上面说'SPA可以在这里wx.error中更新签名'
    // 需要'更新'也就是说配置信息是在'一定时间'内可用的
    wx.config(res)
    // 直接调用 jssdk api
    // 不需要用ready,因为这个地方就算用了wx.ready
    // wx.ready中的回调是会马上执行的,大概原因就是之前已经配置过了,所以一直是'readied'状态
    // 这个地方再用ready就没什么意义了
    wx.onShareAppMessage({ /* ... */ })
    // ....
  } else {
    getConfigFromServer().then((res) => {
      wx.config(res)
      wechat.configData = res
      wx.ready(() => {
        // 调用jssdk api
        // ......
      })
    })
  }
}
```

好的!我知道你一定回问
> 既然一直都是`readied`状态,为什么还需要重新调用`wx.config()`呢?

问得实在**太好了!**

答案就是: 我也**母鸡啊!!!!!**
如果不调用的,实际设备上调用sdk的方法压根不起效!但是如果你重新配置了!就神奇的成功了!

```js
// 实际上我是这样测试ready和config完成的先后顺序的
// 不知道有没有问题
if (wechat.configData) {
  wx.config(res) // 其中debug为true
  wx.ready(() => {
    alert('ready func')
    wx.onShareAppMessage({ /* ... */ })
  })
}
// 上面的代码,'ready func'会先于'config { errMsg: config ok }'被alert出来
```

ps: 其实上面的还是有bug的,因为在魅族某台手机(抱歉我忘了)下,首次进入的路由是没有问题的,但是跳到另一个路由时会发现微信导航栏上右上角的按钮除了收藏意外全没了.至今不知道是因为什么,我还找了网上很多方法都没有起效,希望看到这篇文章的~~有缘人~~大牛能指导一下

pps: 为了解决上面提到的菜单按钮消失的问题,找到了`wx.showOptionMenu`这个方法,一番捣乱之后,一直都是报`permission denied`,后来针对这个接口去搜索,结果看到有人说`这个接口已经废弃了,只是文档没有更新`,我也不知道是真还是假,反正我是没有成功过调用过.
