---
layout: post
title: "2016-06-17"
date: 2016-06-17
tags: [ios]
comments: true
share: true
---

> [16-09-28]清除pod lib <br>
> [16-8-09]用SDWebImage,在缓存图片之前对图片进行 <br>
> [16-06-17]最简单的收起键盘 <br>

##### [16-09-28]清除pod lib

简单的处理是,删除`podfile`再重新`pod install`  
或者选择

```shell
# 安装工具
gem install cocoapods-deintegrate
gem install cocoapods-clean
# 在项目目录下运行
pod deintegrate
pod clean
pod install
```

##### [16-8-09]用SDWebImage,在缓存图片之前对图片进行处理

```c
SDWebImageManager.sharedManager.delegate = self;
```

然后实现SDWebImageManagerDelegate里的[imageManager:transformDownloadedImage:withURL:](http://hackemist.com/SDWebImage/doc/Protocols/SDWebImageManagerDelegate.html#//api/name/imageManager:transformDownloadedImage:withURL:)

##### [16-06-17]最简单的收起键盘

[这篇文章](http://roadfiresoftware.com/2015/01/the-easy-way-to-dismiss-the-ios-keyboard/)有详细说明

```c
// #1
// swift
UIApplication.sharedApplication().sendAction("resignFirstResponder", to:nil, from:nil, forEvent:nil)
//objective-c
[[UIApplication sharedApplication] sendAction:@selector(resignFirstResponder) to:nil from:nil forEvent:nil];

// #2
// swift
self.view.endEditing(true)
// objective-c
[self.view endEditing:YES];
```
