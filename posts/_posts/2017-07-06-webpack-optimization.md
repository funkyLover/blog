---
layout: post
title: "webpack优化手册"
description: "想到什么写什么,持续踩坑,持续填坑"
date: 2017-07-06
tags: [front-end, webpack]
comments: true
share: true
---

主要用于记录webpack的一些优化手段,项目中不断踩坑填坑,如不实际做一点累积,可能下次就会再踩同样的坑,权当记录.

## Common Chunk

这应该是webpack优化中最常被提到的优化手段了吧,简单来说就是把改动较小或几乎不改动的一些基础库(如react,vue等)一并打包进一个vendor bundle,并先于项目自身的源码引入,webpack会帮我们处理依赖关系,这样做之后再开发中就不会每次改动都把所有的基础库都打包一次,而在生产环境下可以对vendor进行缓存,提升速度等.

```js
// 示例webpack配置
module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'material-ui', 'react-router-dom', 'react-tap-event-plugin', 'react-hot-loader/patch'],
    app: './src/main.js'
  },
  // ....
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    })
  ]
}
```

## Uglify

这个没什么好说的,就是压缩,但是在搜索相关资料的时候是还有看到有蛮多人提的issue,配置项略多,估计还是有点坑.不过怎么常用的功能估计坑应该也填得七七八八,如有踩坑者,搜索google或文档应该也能解决.

## babel

在使用babel + webpack提供使用es6语法的便利之时,其实也有一些弊端,例如在使用在使用babel-polyfill去polyfill es6/es7的语法或api的时候,常常导致打包出来的文件过大,这个时候就需要在babel配置上下一点功夫.使用babel-runtime的时候要把默认的polyfill行为设为false,对于像promise等api的polyfill再使用definePlugin来导入.

```js
// .babelrc
{
  "presets": ["env", "react"],
  "plugins": [["transform-runtime", {
    "polyfill": false,
    "regenerator": true
  }]]
}
// webpack
{
  // ...
  plugins: [
    // ...
    new webpack.ProvidePlugin({
      'Promise': ['es6-promise', 'Promise']
    })
    // ...
  ]
}
```

上面我使用的是[es-promise](https://github.com/stefanpenner/es6-promise),可以换成其他promise的实现.只要改一下库名和对应api就可以了.

## process.env.NODE_ENV

就算项目中并没有用到`process.env.NODE_ENV`,可在webpack的plugin上加上了这个define很大可能会减少最后打包出来的文件的体积,这是因为有很多库在开发中就用使用`process.env.NODE_ENV`来判断当前是开发环境还是生产环境.像[react](https://github.com/facebook/react/blob/4b2eac3de7e1dbf5c2dd742fd9989974a83972cb/packages/react-dom/index.js#L3),[react-hot-loader](https://github.com/gaearon/react-hot-loader/blob/9146001a9e8f076ad36669daa3c2bcdfb1631905/src/AppContainer.js#L5)等.

```js
// dev webpack plugin
new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  }
})
// prod webpack plugin
new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  }
})
```

## sass-loader的额外配置

一般而言可能我们会有一个`variables.scss`或者`mixin.scss`文件,里面可能放着大部分的sass变量或者混合器,在开发中如果要用到对应文件中的定义的时候,就需要把文件import进去,在项目可能就会有很多条`@import 'xxx/variables.scss';`这样的语句.可以用以下方法解决.

```js
// webpack config
// ...
// 1. 通过sass-loader配置
// sass-loader支持node-sass所有的配置项,如果我们想scss的变量文件全局可用的话,
// 可以用以下配置
{ 
  test: /\.scss$/, 
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        includePaths: ['./src/styles'],
        data: '@import "variables.scss";@import "mixin.scss";'
      }
    }
  ]
}
// 2. 通过sass-resources-loader
// 顾名思义,这个loader目的就是为了给sass文件配置resources.
// 配置详见 https://github.com/shakacode/sass-resources-loader
{ 
  test: /\.scss$/, 
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
    {
      loader: 'sass-resources-loader',
      options: {
        // 单个文件
        resources: './path/to/resources.scss',
        // 多个文件
        resources: ['./path/to/vars.scss', './path/to/mixins.scss']
      }
    }
  ]
}
```
