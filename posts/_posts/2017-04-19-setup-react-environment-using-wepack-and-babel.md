---
layout: post
title: "使用webpack和babel搭建react开发环境"
description: "译文,原文来自https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel"
date: 2017-04-19
tags: [front-end]
comments: true
share: true
---

`React`是一个出自facebook的js库,用于构建用户交互界面.是一个非常厉害的有很多优势的库,但是却有着非常陡峭的学习曲线.当我开始尝试它,最令我困扰的是,大部分的教程都略过了React开发环境的搭建.

> 译者注: 如果只针对react,你大可以不使用webpack,可以尝试`create-react-app`,它帮你处理了大部分问题,本文主要使用webpack.

所以让我们开始吧,这篇文章非常适合那些害怕沾手react开发环境所需的繁琐的配置而常常采取东凑西拼方式的新手.我的第一个目标就是保持这篇文章简洁易懂.我不会使用任何模板文件,并且你能在github repo上找到完整的设置.我们会使用以下技术:

- Webpack - 模块打包器
- Babel - javascript编译器
- ES6 - 相对较新的javascript的标准
- Yarn - 包管理器
- React

在这边文章结束之前,我们将设置好一个React的开发环境以及一个简单的打印hello world的页面.

去拥抱乐趣吧!!

## 前置准备

在开始项目之前我们需要先安装Yarn和Node到我们的机器上.

就如上面提到的,我们将使用Yarn做为包管理器.它其实和npm相当相似,而且也提供和npm几乎一样的命令行工具.在此之上还有一些npm所不具备的额外的特性.或许你会感到不解,我列举了几个使用Yarn的主要原因:

- 如果你之前已经安装了某个package,你能在没有网络请求的情况下再次安装.意味着你能离线安装package,并且大大减少你安装依赖所需的时间.
- 任何机器安装时都会有相同的依赖关系,意味着一个机器的运行的安装过程也会以同样的方式运行在其他机器上.

如果要了解更多的话,可以去看看Yarn的文档.

Mac Os的用户可以放心使用下面的命令安装Yarn,以为我已经为你们先行尝试过了,使用其他操作系统的可以去查看Yarn的安装说明,以便正确地安装Yarn.

```bash
> brew update
> brew install yarn
```

## 开始入门

打开你的终端创建一个新文件夹.你可以随意命名这个文件夹.进入文件夹后通过`yarn init`命令初始化项目,`yarn init`就像`npm init`一样,会给你提示,只要不停按回车或按你的意愿配置就可以了.

```bash
> mkdir hello-world-react
> cd hello-world-react
> yarn init
```

当`yarn init`命令完成后你能看到你的文件夹(此例中为'hello-world-react')多了一个新的文件`package.json`,就像`npm init`的执行结果一样.

## 安装及配置Webpack

下面我们需要安装webpack和一些依赖.

```bash
> yarn add webpack webpack-dev-server path
```

可以发现在当前文件夹下创建了一个新文件`yarn.lock`.Yarn用这个文件来锁定准确的依赖关系,以保证在其他机器上也能以相同的方式运行.我们不用放心思在这个文件中因为它是自动生成的.

现在我们已经安装了webpack了,我们需要一个配置文件来告诉webpack应该要做什么.在项目文件夹中创建一个新文件`webpack.config.js`,然后用你喜欢的编辑器打开它.

```bash
> touch webpack.config.js
```

然后更改配置文件:

```js
/*
    ./webpack.config.js
*/
const path = require('path');
module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
```

基本上,使用webpack我们需要制定一个`entry`入口和`output`输出.

- `entry`: 指定入口文件,即打包器开始构建流程的地方.
- `output`: 指定打包后的文件应该存放的位置.

无论如何,我们同时还需要`loaders`.通过它们我们能让浏览器能够理解并且运行jsx以及用ES6标准书写的代码.

- `loaders`: 会把我们应用上需要用到的文件进行转化.

配置中的loaders接受一个loader的数组.我们需要指定`babel-loader`把除去`node_module`文件夹以外的所有`.js`及`.jsx`文件进行转化.如果需要的话你总是能添加更多的`loader`.举个例子,如果你项目有单独的样式文件(如css)需要处理,那你会需要用到CSS loader.所有的这些loaders能在webpack的[文档](https://webpack.github.io/docs/list-of-loaders.html)中找到.大方随意去做各种尝试吧.

## Babel设置

我们在webpack配置中指明了使用`babel-loader`.但这个`babel-loader`又是从哪来呢?接下来我们就要把它下载并进行一些设置.

```bash
> yarn add babel-loader babel-core babel-preset-es2015 babel-preset-react --dev
```

我们安装了我们所需要的所有依赖.注意我们添加了`babel-preset-es2015`和`babel-preset-react`,presets是babel的插件,它会告诉babel需要把哪些部分转化成原生的javascript.

然后我们需要去设置babel,设置babel可以通过添加一个`.babelrc`文件来完成.

```bash
> touch .babelrc
```

然后做以下改动

```js
/* 
    ./.babelrc
*/  
{
    "presets":[
        "es2015", "react"
    ]
}
```

就这样.当webpack调用`babel-loader`时它会知道该对文件做什么处理了.

## 设置我们的react组件

到目前为止,我们的目录结构是这样的

```bash
.
|-- node_modules
|-- .babelrc
|-- package.json
|-- webpack.config.js
|-- yarn.lock
```

你不觉得是时候开始添加React的支持了吗?我们创建一个新文件夹`client`,之后再往这文件夹里面添加`index.js`和`index.html`.

```bash
> mkdir client
> cd client
> touch index.js
> touch index.html
> cd .. 
```

现在目录结构是这样的

```bash
.
|-- client
     |-- index.html
     |-- index.js
|-- .babelrc
|-- package.json
|-- webpack.config.js
|-- yarn.lock
```

接下来让我们写点代码吧.我们用一些简单的语句来验证下我们的配置是否能正确运行吧.

编辑`index.js`

```js
/*
    ./client/index.js
    which is the webpack entry file
*/
console.log('Hey guys and ladies!!')
```

编辑`index.html`

```html
<!--
    ./client/index.html
    basic html skeleton
-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React App Setup</title>
  </head>
  <body>
    <div id="root">

    </div>
  </body>
</html>
```

`index.html`会用来在浏览器加载并展示我们的React组件.我前面提到过我们需要`babel`来编译我们的代码以便浏览器运行.我们将用`ES6`以及`JSX`语法来编写React组件的代码.因为这个两个语法都没有得到浏览器很好的支持,所以我们需要用`babel-loader`来帮助我们处理,而后再进行打包输出的结果才是我们最终在`index.html`加载的代码.

要把打包完成的代码添加到我们的html文件,其中一个方法是手动插入一个`script`标签并指定打包后的文件的位置到src属性.一个更加好的做法是通过一个叫`html-webpack-plugin`的插件帮助我们自动完成上面的工作.这个插件提供了一个简单的方式来根据我们的html文件模板生成我们最终需要的html文件.我们只需要关心html文件模板即可,然后通过一些简单配置它就能帮我们完成script的插入.让我们开始动手吧.

## Html-Webpack-Plugin

首先我们需要安装这个插件.在项目的根目录下运行终端.然后执行以下命令

```bash
> yarn add html-webpack-plugin
```

然后编辑`webpack.config.js`添加一些配置.

```js
/* 
    ./webpack.config.js
*/
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {

...

module: {
    loaders: [
        ...
    ]
},
// add this line
plugins: [HtmlWebpackPluginConfig]
}
```

其实配置本身已经非常清晰了.我们导入了`html-webpack-plugin`插件,并且创建了一个该插件的实例,再指定`template`为我们的html模板.`filename`即是最终通过这个插件生成的html文件的文件名.`inject: body`告诉插件把js标签添加到body的结束标签之前.

## 运行!

我们快要完成了.让我们尝试去运行我们的配置.在此之前先做点微小的工作.打开`package.json`并添加一个start script.

```js
/*
    ./package.json
*/
{
  "name": "hello-world-react",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",

  // add the scripts key to your package.json

  "scripts": {
    "start": "webpack-dev-server"
  },

  "dependencies": {
  ...
  },
  "devDependencies": {
  ...
  }
}
```

然后我们能在终端上执行以下命令

```bash
> yarn start
```

然后打开浏览器并访问`http://localhost:8080/`,打开控制台你应该可以可以看出输出`"Hey guys and ladies!!"`.使用localhost:8080是因为`webpack-dev-server`启动了一个开发服务器.注意`webpack-dev-server`会在我们执行`yarn start`时运行.

![console](/images/2017-04/console1.png "console")

成功运行了!让我们来添加一些简单React组件看看会发生什么.

## React, React, React(重说三)

我会创建一个非常简单的`Hello World`的React组件.我们需要安装React的依赖.

```bash
> yarn add react react-dom
```

接下来在`client`文件夹中添加一个`components`文件夹.并创建一个`App.jsx`.

```bash
> cd client
> mkdir components 
> cd components
> touch App.jsx
> cd ../..
```

现在我们的目录结构是这样子的

```bash
.
|-- client
     |-- components
         |-- App.jsx
     |-- index.html
     |-- index.js
|-- .babelrc
|-- package.json
|-- webpack.config.js
|-- yarn.lock
```

React的组件命名约定俗成地使用`首字母大写的驼峰式`命名规则.所以我们文件的名字也是有个大写字母开头.后缀既可以是`jsx`也可以是`js`.我觉得当要使用`jsx`语法时最好还是明确的使用`jsx`作为后缀.

接下来编辑`App.jsx`文件

```js
/*
    ./client/components/App.jsx
*/
import React from 'react';

export default class App extends React.Component {
  render() {
    return (
        <div style={{textAlign: 'center'}}>
            <h1>Hello World</h1>
        </div>);
  }
}
```

最后为了把我们的组件渲染到我们的页面上.把`index.js`的`console.log`替换成以下的代码

```js
/* 
    ./client/index.js
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('root'));
```

打开终端再次运行我们的项目,确认终端当前目录为项目的根目录.

```bash
> yarn start
```

![console2](/images/2017-04/console2.png "console2")

这就对了!非常高兴你完成我们一开始的目标!!

## 总结

现在我们已经搭好React的开发环境了.我希望这篇教程能让你明白这些配置是怎么一回事以及为什么我们需要这些配置.同时,如果每个项目都需要那么多配置的话,你可以fork我的[repo](https://github.com/joykare/react-startpack)并以此为基础来改动.

请大胆尝试不同的webpack配置,如果发现了非常cool的东西也欢迎在评论低下留言.(`译者注: 原文地址 https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel#conclusion`)

最后,在这个教程之后你能够并且应该尝试去完成一个深度的React的项目.Wow~
