---
layout: post
title: "Fibers, Event Loop和Meteor"
description: "译文,关于Meteor以及Fibers,来自https://meteorhacks.com/fibers-eventloop-and-meteor/"
date: 2017-03-16
tags: [nodejs, meteor]
comments: true
share: true
---

> 写在前面: 刚开始使用Meteor,在官方文档看到`In Meteor, your server code runs in a single thread per request`这句话.一开始因为出于对nodejs粗浅的理解(单线程)并没有很理解,所以找了一些资料,这篇文章解释清晰到位,虽然已经是旧文(2013年),不过还是打算翻译一下以供学习,如果错漏希望大家不吝指教.  
> 原文出自 [https://meteorhacks.com/fibers-eventloop-and-meteor/](https://meteorhacks.com/fibers-eventloop-and-meteor/)

Meteor用Fibers来实现许多重要的特性.事实上,Meteor的流行很可能是得益于使用了Fibers,虽然在深度了解Meteor之前可能不会意识到这件事.

要了解Fibers是如何起效以及如何与Meteor进行关联还是有些困难的.但一旦了解清楚了,会有助于我们对Meteor内部工作原理有更加清晰的理解.

> 作者注: Fibers原来并不在`Pro Meteor topic`讨论列表里,不过因为有人问到了,所以我决定写这篇文章,让我们开始吧!

## Event Loop(事件循环)和Node.js

Meteor是基于Node.js的,所以我们不能忘记Node.js的Event Loop(事件循环).虽然Node.js运行在单线程上,但是感谢事件循环以及事件驱动模式,I/O操作(主要是网络请求及硬盘读写)不会阻塞程序的执行.取而代之是提供一个回调函数在I/O操作结束后以供调用,然后再继续运行程序.

下面是两个伪代码例子,表示两个不同的任务

```js
// Call functions.
fetchTwitterFollowers('arunoda');
createThumbnail('/tmp/files/arunoda.png', '/opt/data/arunoda.thumb.png');

// Define functions.
function fetchTwitterFollowers(username) {
  TwitterAPI.getProfile(username, function(){
    Model.setFollowers(profile.username, profile.followers, function() {
      console.log('profile saved!');
    });
  });
}

function createThumbnail(imageLocation, newLocation) {
  File.getFile(imageLocation, function(err, fileData) {
    var newImage = ImageModule.resize(fileData);
    File.saveFile(newLocation, function() {
      console.log('image saved');
    });
  });
}
```

现在让我们来看看上面两个方法执行时的时序

![time flow](/images/2017-03/time-flow.png "time flow")

> 被标注为绿色的是fetchTwitterFollowers任务,而被标注成橙色的则是createThumbnail.深色代表CPU时间,浅色代表I/O时间.  
> 蓝色条表示任务队列的等待时间,红色条则是空转时间(CPU空闲)

## 观察

上面的图展示了一些有趣的信息.

- 任务的执行顺序不定`(译者注: 表达的应该是回调的执行)`,I/O操作耗费的时间也不定以及它们不会阻塞其他程序的执行.上例可以看到,`ImageModule.resize`不需要等待`Twitter.getProfile`才执行.
- CPU被占用的确会阻塞其它任务执行.在上图中间区域,你能看到那条蓝色条代表尽管`TwitterAPI.getProfile`I/O操作已经完成了但依然不能开始执行`Model.setFollowers`.这是因为`ImageModule.resize`已经占用了CPU,所以阻塞了事件循环.就如前面提到的一样,Node.js是运行在单线程上的.这也是为什么Node.js不适用于一些CPU密集型场景如图像处理和视频编码.

你也能看到有三个红色条指明了CPU空闲事件.如果我们的例子还有其他任务的话,就用占用这些时间去执行.

## Fibers

现在你了解事件循环是怎么工作,以及其高效率的原因所在.但依然不能忽视问题: 回调函数.回调函数(或说回调模式)使得Node.js的代码难以推理(或被描述为回调沼泽).错误处理以及回调嵌套让代码变得难以书写,它们的存在导致代码更难维护以及扩展.这也是为什么Node.js那么难学(以及难用)

幸运的是,已经有几种技术可用于攻克这个难题.如`Fibers`, `Promises`, `基于Generator的协程`等等.

Meteor底层使用了Fibers,在这基础上封装了上层的APIs.在我们更深入了解之前,让我们来看看Fibers是如何工作的.

![time flow](/images/2017-03/time-flow2.png "time flow-fibers")

Fibers提供了一层事件循环的抽象,允许我们按顺序的执行任务(或方法).让我们可以摆脱回调模式来书写异步代码.我们取得两个模式的精华-异步的高效率以及同步模式思考书写的代码.在这之后是由Fibers帮我们处理事件循环的.

如果运用恰当Fibers将非常的强有力(Meteor就用得非常好).而且,使用Fibers造成的开销也是微乎其微的.

## Meteor是如何使用Fibers的?

Meteor在其APIs上对Fibers进行了抽象,让我们可以避免回调模式.而且最好的是你在书写避免回调模式的代码时甚至都没有察觉在使用Fibers,它就如此起效了.

Meteor为每一个客户端的请求(DDP请求)创建一个Fiber.默认的,对于每一个客户端Meteor每次只会处理一个请求,意味着每次只会为每个客户端生成一个Fiber.但是这是可以进行改动的.

Fibers是Meteor如此受欢迎的理由之一.因为它允许我们的Node.js应用脱离回调模式,这会吸引许多讨厌回调模式的开发人员.

## 如何在Meteor中使用异步方法

Meteor的API不能100%的满足我们的需求,有时候我们需要使用npm模块来处理事情.在不使用回调的情况下该怎么做呢?

举个例子,假设你需要使用Github的npm模块去请求用户的资料.而这个过程需要在一个Meteor的Method里面完成,最后我们需要把这个资料从这个Method中返回出去.好的,让我们尝试来实现这个需求

```js
var GithubAPI = Meteor.require('github');
var ghapi = new GithubAPI({version: "3.0.0"});

Meteor.methods({
  getProfile: function(username) {
    ghapi.user.getFrom({user: username}, function(err, profile) {
      // How to return?
    });

    // We need to return the profile from here.
  }
});
```

我们不能像上面使用回调.没有办法在回调中把用户资料返回出去,因为Meteor的Method不会等待回调再执行.现在我们需要学习怎么使用Fibers来处理这种情况?还是说有更好的选择?

Meteor已经考虑到这种情况并且给我们提供了简单的API来处理.这个还没出现在文档中`(译者注: 这篇是老文了,现在文档已经能查到相应的说明.详见 http://docs.meteor.com/api/core.html#Meteor-wrapAsync`,这里介绍下该如何使用.

> 作者注: meteor-npm同时也有一系列的async-utilities搭配npm模块工作.

```js
function getUserProfile(req, callback) {
  ghapi.user.getFrom(req, callback);
}
var wrappedGetProfile = Meteor._wrapAsync(getUserProfile);

Meteor.methods({
  getProfile: function(username) {
    return wrappedGetProfile({user: username});
  }
});
```

上面的代码非常好理解,我们用一个方法包裹住`ghapi.user.get`,然后用`Meteor._wrapAsync`调用该方法去通知Fibers.接着我们就能在其他使用方法和Meteor的APIs中使用上面的`wrappedGetProfile`来获取用户信息了.

如果你知道bind的话,你可以用下面的代码来达到同样的效果

```js
var wrappedGetProfile = Meteor._wrapAsync(ghapi.user.getFrom.bind(ghapi.user));
```

## Finally

现在你对事件循环,Fibers以及Meteor是如何使用Fibers都有个更好的了解了.同时你知道该如果通过`Meteor._wrapAsync`来使用异步方法.是时候来应用这些知识来增强你的应用了.

## 额外补充

如果你在希望学习更多有关Fibers等方面的技术,请查阅下面列出的出自[EventedMind](https://www.eventedmind.com/)非常好的视频.

- [Introducing Fibers](https://www.eventedmind.com/feed/nodejs-introducing-fibers)
- [Using Futures](https://www.eventedmind.com/items/nodejs-using-futures)
- [Meteor._wrapAsync](https://www.eventedmind.com/items/meteor-meteor-wrapasync)
- [Understanding Event Loop Async and Fibers](https://www.youtube.com/watch?v=AWJ8LIzQMHY)
