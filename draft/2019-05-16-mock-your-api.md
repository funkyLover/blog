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

开发过程中, 前端都会以后端提供的 api 文档作为标准, mock 模拟 api 返回数据, 以确保在开发中就保证功能的完整性.

而关于如何更好的进行 mock, 业界/开源社区可谓有相当多质量上乘的解决方案, 如[easy-mock](https://github.com/easy-mock/easy-mock), [yapi](https://github.com/YMFE/yapi)等.

但是越是大而全的工具很多时候功能会超越需求非常多, 要简单实现 mock api 的需求也有非常多小而美工具库可以使用.

而本文主要介绍[mock-server][1]这个工具的使用

选用[mock-server][1]的主要原因除了~~是我开发的~~使用比较简单之外, 更多的是满足了下文提到的一些开发需求, 如果你也有同样的需求而还没找到解决方案的话, 不妨试用一下.

## 安装 & 基本配置

可选全局安装, 安装完成过, 就可以通过`mock`启动 mock server

```bash
npm install -g mock-server-local

mock -h # 即安装成功

# 用 -d 指定mock数据配置目录, 为空时默认为当前目录 `.`
mock -d ./mock

# 用 -p 指定server的端口, 默认为8888, 如果8888被占用会端口号+1, 直至端口可用
# 注意如果指定了端口号, 但是端口号被占用的话, 会抛出错误
mock -d ./mock -p 8080
```

个人比较习惯在项目中进行安装, 并通过`npm script`启动, 而 mock 数据也存放在项目当中, 通过 git 等版本管理工具在项目成员当中共享, 假设项目目录为`proj`

```js
// proj/package.json
{
  // ...
  "script": {
    "mock": "mock -d ./mock -p 8080"
  }
  // ...
}
```

```bash
# 本地安装
npm install mock-server-local --save-dev

# 启动mock server
npm run mock

> mock@1.8.9 mock /path/to/proj
> mock -d ./mock -p 8080

you can access mock server:
http://127.0.0.1:8080
http://ww.xx.yy.zz:8080

you can access mock server view:
http://127.0.0.1:8080/view
http://ww.xx.yy.zz:8080/view
```

就这样 mock server 就已经启动了, 访问`127.0.0.1:8080/view`即可看到 mock server 的控制页面

就下来就是调整代理, 让应用的请求发送到 mock server 进行处理

如果你使用的`webpack`来构建你的项目, 那你只需要改动一下'webpack.devServer'的配置即可, 假设我们的业务域名为`target.mock.com`, 而接口基本都是`target.mock.com/api/**`, 可以这样进行配置

```js
devServer: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080', // mock server
      headers: {
        host: 'target.mock.com' // 业务域名
      },
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setheader('host', 'api.mock.com'); // 业务域名
      }
    }
  }
}
```

接着在开发中, 启动 webpack 之后, 发出的请求`/api/**`都会被转发到

而如果应用本身不使用 webpack 或其他带 server 功能的打包工具, 可以使用代理工具进行代理

如果是用 Chrome 浏览器调试应用, 可以下载`SwitchyOmega`一类可配置, 把特定域名的请求进行转发

使用微信开发者工具的话, 可直接设置代理, `设置` -> `代理设置` -> `勾选手动设置代理`

推荐使用[whistle](https://github.com/avwo/whistle), fiddler 一类功能完整代理工具, 类似配置如下

```bash
target.mock.com/api 127.0.0.1:8080 # 接口请求转发到mock server

target.mock.com www.xx.yy.zz # 页面从正常的开发测试机ip中获取, 或本地调试服务器
```

### mock 数据配置

mock server 的配置是根据 mock 目录的目录结构生成的, 假设需要进行 mock 的 api 接口完整的 url 为`target.mock.com/api/login`, 而我们需要模拟以下三种情况的返回

- 登录失败, 返回错误码-1 既错误信息
- 登录成功, 返回错误码 0 和用户信息, 且要带上登录态 cookie
- 请求时间超过 8 秒, 导致前端请求超时

那么目录结构与数据配置文件应该如下所示

```js
|- proj
  |- mock
    |- target.mock.com
      |- api
        |- login
          |- 登录成功
          |- 登录失败
          |- 请求超时

// 登录失败
// proj/mock/target.mock.com/api/login/登录失败/data.js
module.exports = {
  code: -1,
  msg: '登录失败!'
};

// 登录成功
// proj/mock/target.mock.com/api/login/登录成功/data.js
module.exports = {
  code: 0,
  msg: '登录成功',
  username: 'ahui'
};
// proj/mock/target.mock.com/api/login/登录成功/http.js
module.exports = {
  header: {
    'Set-Cookie': 'token=123456789;'
  }
};

// 请求超时
// proj/mock/target.mock.com/api/login/请求超时/data.js
module.exports = {};
// proj/mock/target.mock.com/api/login/请求超时/http.js
module.exports = {
  delay: 8
};
```

根据上面目录配置, 返回 mock server 页面的 mock 面板`127.0.0.1:8080/view/mocks`, 就可以看到以下页面

![mock面板](/images/2019-05/mock/1.png "访问mock server页面, 打开mock面板")

现在我们只需要勾选其中一个状态, 然后发出请求即可

![请求mock server](/images/2019-05/mock/2.png "访问mock api, 返回所选状态的数据")

就这样就可以快乐 mock api 了

## mock 配置详解

看了上面的里面就大致都清楚了, `data.js`里面定义接口返回的数据, 而`http.js`中顾名思义就是定义 http 请求相关行为的, 例如可以定义响应头, http 请求状态码, 请求耗时等.

> data 同时也支持使用 json 文件, 非 js/json 文件的一律当 json 格式处理, 而 http 则支持通过 js 文件定义

`http.js`可选配置如下

```js
module.exports = {
  delay: 8, // 耗时8秒
  status: 200 // http状态码
  header: {
    // ... http响应头
  }
}
```

而`data.js`除了可以简单定义返回数据之外, 还可以直接返回模板, 如

```js
module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  这个是由mock server返回的模板
</body>
</html>
`;
```

并且可以返回一个方法, 通过脚本逻辑来处理最终要返回的数据

```js
// ctx: https://koajs.com/#context
module.exports = function(ctx)  {
  // 逻辑处理

  return {
    data: {}, // 响应数据
    header: {}, // 如有需要可以配置, 同http.js#header
    delay: 0.1, // 如有需要可以配置, 同http.js#delay
    status: 200 // 如有需要可以配置, 同http.js#status
  }
}

// 如果当中有异步逻辑, 请返回promise, 或直接使用async方法
module.exports = async function(ctx)  {
  // 异步逻辑处理
  await asyncFn();

  return {
    data: {}, // 响应数据
    header: {}, // 如有需要可以配置, 同http.js#header
    delay: 0.1, // 如有需要可以配置, 同http.js#delay
    status: 200 // 如有需要可以配置, 同http.js#status
  }
}
```

## 代理线上数据

在开发过程可能出现这样的场景, 一期项目已经开发完了, 现在进行二期迭代的开发工作, 这个时候由于之前的接口后台已经都实现, 二期开发中只想对新增的api进行mock

这个时候可以修改一下代理的配置

```bash
# 新增接口转发至mock server
target.mock.com/api/new1 127.0.0.1:8080

target.mock.com/api/new2 127.0.0.1:8080

# 其余接口直接使用线上/测试机数据
target.mock.com ww.xx.yy.zz
```

或者可以直接使用mock server提供的简单的代理功能, 只需要在mock目录个目录下新建`proxy.js`文件

```js
|- proj
  |- mock
    |- proxy.js

// proj/mock/proxy.js
module.exports = {
  target.mock.com: 'https://ww.xx.yy.zz' // 这里可以指定ip也可以指定域名, 但是协议类型是必须要带上的
}
```

这样配置之后, 可以把所有的`target.mock.com`的请求都直接转发到mock server

当对应请求的url并没有勾选任何一个返回状态, 或根本没有配置对应的url的话, mock server都会帮助我们把请求转发到目标ip

假设没有配置`proxy.js`的话, 对于没有命中的url请求, 会根据host直接请求线上的资源或借口

## 模板接口调试 & 微信登录支持

在非前后端分离的架构中, 很常会出现这样的需求, 应用的入口即是后端接口, 后端会进行鉴权, 拼接模板内容和数据, 然后直接返回页面给到前端进行展示.

这样的场景mock server可以很简单通过`data.js`中导出方法的方式来处理

```js
const fs = require('fs');

module.exports = async ctx => {
    let html = '';

    let template = fs.readFileSync('path/to/html/template/index.ejs'); // 举例ejs, 实际可以处理任何模板引擎

    // 这里处理模板的语法
    // 1. 处理类似include的拼接模板的语法
    // 2. 处理类似<%= =>插入变量/数据的语法
    // 3. 等等等等....

    html = processedHtml;

    return {
        data: html,
        header: {
          'Set-Cookie': 'SESSIONID=123123123123;'
        };
    };
};
```

这样子我们就可以进行模板接口的调试了. 还记得我们的上一个需求吗, 我们希望可以使用线上已有接口和数据状态(如开户数据), 但是又希望可以调试本地模板

比较好的方式是, 本地修改模板然后把模板改动上传到开发服务器, 然后直接请求开发服务器调试

但是如果改动比较多

[1]: https://github.com/funkyLover/mock-server
