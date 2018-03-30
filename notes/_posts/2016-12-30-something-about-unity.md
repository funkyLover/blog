---
layout: post
title: "unity开发相关"
date: 2016-12-30
tags: [unity]
comments: true
share: true
---

##### [16-10-11]unity整合到ios之后,unity的启动问题

就结而论,当unity作为app中的一部分整合到ios app之后,unity只能随着app启动而启动,并不能在app运行过程中关闭unity后又重新启动(可以暂停再重新开始,但是不能关闭)
更多详情可以看看这些讨论和问题  
[http://stackoverflow.com/questions/12596772/unity-ios-integration](http://stackoverflow.com/questions/12596772/unity-ios-integration)
[http://www.markuszancolo.at/2014/05/integrating-unity-into-a-native-ios-app/](http://www.markuszancolo.at/2014/05/integrating-unity-into-a-native-ios-app/)
[http://alexanderwong.me/post/29949258838/building-a-ios-unity-uiview-uiviewcontroller](http://alexanderwong.me/post/29949258838/building-a-ios-unity-uiview-uiviewcontroller)
[http://stackoverflow.com/questions/15557785/activating-unity-on-ios-button-click](http://stackoverflow.com/questions/15557785/activating-unity-on-ios-button-click)

##### [16-09-14]unity整合到ios app的问题(unity版本5.4.0f3)

详情可以看我在github提的issue[blitzagency/ios-unity5#17](https://github.com/blitzagency/ios-unity5/issues/17)

当时跟着文档走到最后一步还是报了错

```shell
Undefined symbols for architecture armv7:
  "il2cpp::icalls::mscorlib::System::Char::GetDataTablePointers(unsigned char const**, unsigned char const**, double const**, unsigned short const**, unsigned short const**, unsigned short const**, unsigned short const**)", referenced from:
      _Char_GetDataTablePointers_m2324968695 in Bulk_mscorlib_1.o
ld: symbol(s) not found for architecture armv7
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

需要更改xcode的配置`c++ Language Dialect Option : Compiler Default -> C++ 11`

原因大概是unity使用的c++编译器与xcode的版本匹配不上,导致最终unity生成的代码没办法在xcode上运行