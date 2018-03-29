---
layout: post
title: "electron相关"
date: 2017-03-01
tags: [electron]
comments: true
share: true
---

##### globalShortcut.isRegistered在mac平台下无法按预期工作

在mac平台下isRegistered只能去对比本应用是否注册过该快捷键,无法检测全局下快捷键的绑定情况,同样情况使用register时就算快捷键已被其他应用绑定也同样会成功.详细讨论可以在[electron#3808](https://github.com/electron/electron/issues/3808)上找到.
