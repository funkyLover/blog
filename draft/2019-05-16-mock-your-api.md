---
layout: post
title: "前后端分离之更好的mock你的后端api"
description: "注意! 广告警告! 广告警告! 广告警告!"
date: 2019-05-16
tags: [mock, node, front-end]
comments: true
share: true
---

在一个完整应用的开发周期中, 一般前端与后端都是并行开发的, 各自完成自己的开发工作后进行联调, 联调通过再进行提测/发布.

开发过程中, 前端都会以后端提供的api文档作为标准, mock模拟api返回数据, 以确保在开发中就保证功能的完整性.

而关于如何更好的进行mock, 业界/开源社区可谓有相当多质量上乘的解决方案, 如[easy-mock](https://github.com/easy-mock/easy-mock), [yapi](https://github.com/YMFE/yapi)等.

但是越是大而全的工具很多时候功能会超越需求非常多, 要简单实现mock api的需求也有非常多小而美工具库可以使用.

而本文主要介绍[mock-server][1]这个工具的使用

选用[mock-server][1]的主要原因除了~~是我开发的~~使用比较简单之外, 更多的是满足了下文提到的一些开发需求, 如果你也有同样的需求而还没找到解决方案的话, 不妨试用一下.

[1]: https://github.com/funkyLover/mock-server
