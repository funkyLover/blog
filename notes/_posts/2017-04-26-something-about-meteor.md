---
layout: post
title: "2017-04-26"
date: 2017-04-26
tags: [Meteor]
comments: true
share: true
---

> 17-04-26]macos下运行多个meteor app时报错`Error: ENFILE: file table overflow` <br>
> 17-04-26]运行meteor项目时node-sass报错 <br>

##### [17-04-26]macos下运行多个meteor app时报错`Error: ENFILE: file table overflow`

详情参考这个issue,解决如下,根源是macos对打开的文件数量有限制,解除这个限制就好了.

```bash
$ echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
$ echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -w kern.maxfiles=65536
$ sudo sysctl -w kern.maxfilesperproc=65536
$ ulimit -n 65536
```

##### [17-04-26]运行meteor项目时node-sass报错

```shell
ERROR in Missing binding 
...
...
Found bindings for the following environments:...
...
This usually happens because your environment has changed since running `npm install`.
Run `npm rebuild node-sass` to build the binding for your current environment.
...
```

其实这个错误描述得很清楚,大意就是说,安装依赖时使用的node版本和你运行项目时使用的node版本不一致(这是因为node-sass会根据不同的node版本或系统构建出不同的结果),解决方法就是安装依赖时不能使用`npm install`而要用`meteor npm install`(meteor使用node版本可能与本机node版本不一致).
