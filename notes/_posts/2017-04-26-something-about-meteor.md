---
layout: post
title: "IDE或代码编辑器"
date: 2017-03-01
tags: [IDE & Editor]
comments: true
share: true
---

##### macos下运行多个meteor app时报错`Error: ENFILE: file table overflow`

详情参考这个issue,解决如下,根源是macos对打开的文件数量有限制,解除这个限制就好了.

```bash
$ echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
$ echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -w kern.maxfiles=65536
$ sudo sysctl -w kern.maxfilesperproc=65536
$ ulimit -n 65536
```
