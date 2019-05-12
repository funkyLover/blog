---
layout: post
title: "使用vscode调试你的node应用"
description: "都9102年了, 你的nodejs应用还在用console调试吗?"
date: 2019-05-11
tags: [vscode, node]
comments: true
share: true
---

从一开始使用 webstorm 内置的 debug 功能, 到使用[node-inspector](https://github.com/node-inspector/node-inspector)库进行调试顺便脱离 webstorm 的笨重, 再后来 nodejs 内置了[debugger 模块](https://nodejs.org/dist/latest-v10.x/docs/api/debugger.html)也可以帮助调试我们的应用.

目前个人使用 vscode 进行日常开发, 本文主要介绍 vscode 平台的 debugger 调试功能.

vscode 本身就内置了 nodejs 的 debug 支持, 除此之外还有有非常多 debug 的扩展插件可供安装使用.

可以点击`调试菜单` -> `安装调试附加器`, 会自动去到下载插件的页面, 并筛选出`debugger`类型的插件, 按下载量进行排序.

![下载debugger插件](/images/2019-05/debugger-1.png "菜单 -> 调试 -> 安装调试附加器")

不仅支持 nodejs/js 的调试, 如 C/C++, python, go 等都有相应 debugger 插件, 一般而言下载量更多都会比较靠谱.

而我们主要是为了调试 nodejs 应用, 就不需要额外去下载插件了.

## 快速对当前文件进行 debug

要对当前打开的文件进行 debug 在 vscode 是非常简单的事, 只需要按快捷`F5`或在编辑器左侧 debug 面板按下启动的按钮, 然后选择 debug 类型即可.

![启动debug](/images/2019-05/debugger-2.png "编辑器左侧菜单 -> 调试 -> 运行")

![选取debug运行类型](/images/2019-05/debugger-3.png "选择debug类型")

**注意**: 只有下载了对应的 debug 插件这里才会有显示并可供选择, 例如只有安装了 C++ debug 扩展插件, 这里才会出现 C++的选项.

启动之后就可以对当前文件进行调试, 调试界面有几个模块的内容, 可以看到断点, 调用堆栈, 脚本载入情况, 调试控制台等.

留意下调试控制台, 在调试时 vscode 执行的命令, 实际上就是使用了 nodejs 原生的[debuuger 模块](https://nodejs.org/dist/latest-v10.x/docs/api/debugger.html).

![debug运行时界面](/images/2019-05/debugger-4.png "debug运行时界面")

## 新建 debug 配置

虽然可以很方便对当前文件进行 debug, 但很多时候并不能满足我们的调试需求.

因为需要调试的进程大多都是需要特定的命令进行启动的, 例如构建命令, 测试命令, 或是后端应用的启动命令.

而上面也看到调试时执行的命令, 只是简单用 node 运行当前文件并带上调试标志(`--inspect-brk`)而已.

这个时候我们需要对特定调试目标单独进行配置

去到编辑器面板左侧菜单, 进去`调试`面板, 然后点击新建`添加配置`, 选取对应的 debug 类型即可. 这里直接选 node 即可.

![添加配置](/images/2019-05/debugger-5.jpg "编辑器左侧菜单 -> 调试 -> 添加配置 -> 选取类型")

之后 vscode 会在打开项目路径中帮我们新增`.vscode/launch.json`文件, 文件中已经补充了最基础的配置.

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${file}"
    }
  ]
}
```

`configurations`数组里面的每一个对象, 都是一个单独的调试配置, 其中`type`, `request`, `name`为必填参数.

- type: debug 运行类型, 如 node/go/c/c++....
- request: launch/attach, 两者一同将在下面讲解
- name: 用于在调试面板启动时区分开每个配置

除了这三个参数以外其余参数均为可选参数.

剩余可配置的参数以及其对应的可选值数量众多, 大家可翻阅[文档(debugging#launchjson-attributes)](https://code.visualstudio.com/docs/editor/debugging#_launchjson-attributes)查看具体参数的意义.

使用`^(control) + space(空格)`快捷键可以唤起代码提示, 也能看到相应说明

![编辑配置](/images/2019-05/debugger-6.png "参数说明")

先来简单看下默认的基础配置

**注意**: vscode 会根据当前打开的项目的情况给出最适合的配置, 如读取`package.json`中的`scripts`字段并进行配置, 所以默认配置不一定都相同.

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${file}"
}
```

其中`program`参数为可执行的命令或文件的绝对路径, 可以理解为程序的启动命令.

而`${file}`占位符其含义则为编辑器当前焦点所处的文件.

所以使用上面的配置来启动 debug 时, 效果和我们上面提到的对当前文件进行 debug 是一样的.

再举个我平常使用比较频繁的场景的例子. 就是程序的启动命令为一个 npm 模块提供的命令.

- 启动测试进程: Jest/Mocha/Ava
- 启动构建进程: Webpack/Parcel
- 启动后端进程: Sails/Meteor

以`vue-cli@3.x`生成构建配置为例, 一般而言较为复杂构建配置, 需要检查 cli 生成 webpack 配置对不对.

很多时候生成的构建配置如果不符合我们的预期, 而又没办法一眼看出问题所在时, 我们就可以对生成配置的过程进行调试.

```json
{
  "type": "node",
  "request": "launch",
  "name": "调试inspect检查webpack config生成逻辑",
  "program": "${workspaceFolder}/node_modules/.bin/vue-cli-service",
  "args": ["inspect"],
  "env": {
    "VUE_CLI_SERVICE_CONFIG_PATH": "${workspaceFolder}/build/vue.config.js"
  },
  "cwd": "${workspaceFolder}"
}
```

简单解释下上面的配置, 启动命令为`当前工作项目目录(${workspaceFolder})`下的node_modules/.bin/vue-cli-service.

启动参数(`args`)为`inspect`.

env为配置node环境变量(process.env), 其中指定了VUE_CLI_SERVICE_CONFIG_PATH为`当前工作项目目录(${workspaceFolder})`下的build/vue.config.js.

cwd可指定在某一文件夹下执行启动命令.

使用上面的配置运行时. 可观察调试控制台的输出.

```bash
/usr/local/bin/node --inspect-brk=31449 node_modules/.bin/vue-cli-service inspect
```

接着就可以对生成配置的过程进行调试.

## request: launch / attach

因为调试配置中可选参数实在太多了, 对其一一进行解析意义不大.

再来有很多参数我也没有实际使用过, 解读可能出现偏差, 所以这里就不班门弄斧了, 有需要可以直接翻阅[官方文档(debugging)](https://code.visualstudio.com/docs/editor/debugging)

这里主要讲下必填参数 request, 有两个可选值, `launch(启动)`和`attach(附加)`.

分别代表 vscode 目前支持的两种调试模式, 分别对应两种工作流.

回到我们最熟悉的 debug 工具 - chrome devtools, 如果是我们日常对网页进行调试这样的工作流, 对应回 vscode 的调试模式, 就是`attach`模式.

因为当我们打开 devtools 时, 浏览器已经在运行了, 而打开 devtools 只是简单的把调试工具`attaching`到浏览器而已.

而 vscode 中的`attach`模式也是一样的道理, 我们可以先以 debug 模式运行程序, 然后通过`attach`把 vscode 的 debugger 连接到已经运行的程序中去.

而`launch`则可以理解为, vscode 帮我们以 debug 模式来运行程序, 并自动把 vscode 的 debugger`attach`到运行的进程中.

## 相关文档/扩展阅读

- [https://code.visualstudio.com/docs/editor/debugging](https://code.visualstudio.com/docs/editor/debugging)
- [https://code.visualstudio.com/docs/nodejs/nodejs-debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [https://github.com/microsoft/vscode-recipes](https://github.com/microsoft/vscode-recipes)
- [https://github.com/search?q=vscode+recipe](https://github.com/search?q=vscode+recipe)
