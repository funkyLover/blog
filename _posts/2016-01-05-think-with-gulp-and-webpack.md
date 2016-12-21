---
layout: post
title: "gulp与webpack的迷思"
description: "gulp和webpack该如何抉择,尘世间一名迷途小码农的思考"
date: 2012-05-22
tags: [front-end]
comments: true
share: true
---

## 你知道吗?webpack出来统一天下了!

我已经不是第一次看到这类似的话语,为数不少的人都觉得webpack是目前前端工程化完整性解决方案,打出了终于不再用纠结使用grunt或是gulp了的旗号,只要使用webpack就足够了

而事实果真如此?

首先看看[webpack官网](http://webpack.github.io/docs/what-is-webpack.html)给出的解析
> webpack is a module bundler.

简单来说,官方对webpack的定位是模块打包器,相比于gulp或是grunt,webpack的竞争对手应该是browserify之流

就连webpack官方也给出了[webpack with gulp](http://webpack.github.io/docs/usage-with-gulp.html)的一些说明

虽然webpack的确可以代替gulp的一些功能,但是非常明显webpack和gulp/grunt就不是`一个职能`的工具,所以说`取代`还言过其实(之前我的一个[提问](http://segmentfault.com/q/1010000004179858))

那么问题来了

## 如何构建一个gulp与webpack相配合的前端工作流呢?

> 为什么是`gulp`而不`grunt`?
> 因为我用的是gulp - -!

要构建这样一个工作流,首先要理清几个问题

- 什么工作应该交给gulp,什么工作应该交给webpack
- webpack貌似支持增量更新,gulp支持增量更新吗?(这个是我之前一直很纠结的问题)
- 如何实现livereload?

### 对于第一个问题

就如前面所说,webpack只是一个模块打包器,所以,交予webpack处理的应该已是经过各种lint检查,各种编译处理的代码,而各种检查,各种预处理就应该交给gulp之流了,最后压缩代码应该要交给webpack最后打包时再去执行

### 对于第二个问题

之前一直没有注意这个问题
看看gulp的基本使用

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

对于开发中gulp会使用`watcher`实时检查文件是否更新,检查到有更新则马上跑相应的构建任务,但是有上面的代码可以看出,gulp每次都只能通过通配符匹配大量的文件,而不能就单单获取修改过的文件,这种情况在大型项目中每次构建都会花不少时间,更别论要在构建任务之后再加一个webpack的打包任务

不过所幸上网找到一个[gulp-changed](https://github.com/sindresorhus/gulp-changed)的插件,实在棒!

### 对于第三个问题

之前开发时live reload都是交给gulp的,而现在gulp的构建任务并不是在任务链的最后端,由gulp来实现显然不再合适

## 实践实践

基于上面的思考,我做了个尝试[项目](https://github.com/funkyLover/funky-seed)

做些简单的说明,上面的项目只有简单的几个构建任务

### 对于`js`

```javascript
gulp.task('js', function() {
  return gulp.src('src/**/*.js')
        .pipe($.changed('build'))
        // .pipe($.babel({
        //   presets: ['es2015', 'react']
        // }))
        .pipe($.eslint({config: 'eslint.config.json'}))
        .pipe($.eslint.format())
        .pipe(gulp.dest('build'));
});
```

只简单的用eslint检测一下语法而已,而注释的部分,是使用babel把es6的代码转化成es5的代码,但是这部分应该是由webpack在最后打包阶段处理,所以去掉了

### 对于`css`

```javascript
gulp.task('css', function() {
  return sass('src/**/*.scss')
        .pipe($.changed('build'))
        .on('error', sass.logError)
        .pipe($.replace('@@FILEURL', fileUrl))
        .pipe(gulp.dest('build'));
});
```

就是把scss转化成css,并替换掉css文件中的占位符(可以根据需求加上自动合并雪碧图或者postcss处理等等)这里要说明一下在这个示例项目中其实并没有实际编写任何css或scss,因为项目中的todo应用实际是从[redux todo](https://github.com/rackt/redux/tree/master/examples/todomvc)直接拷贝的 = =!

### 对于`html`

```javascript
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
        .pipe($.changed('build'))
        .pipe($.replace('@@FILEURL'), fileUrl)
        .pipe(gulp.dest('build'));
});
```

就没什么好说的,就是做了一下占位符替换而已
如果是使用其他模板引擎就可以在这里进行编译

`而live reload应该怎么做呢?`

参考了一下[react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)和[redux todo](https://github.com/rackt/redux/tree/master/examples/todomvc)(其实还是直接拷贝的= =)

```javascript
gulp.task('default', ['clean', 'js', 'css', 'html', 'watch'], function() {
  var app = require('./devServer');
  var port = 3000;
  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
  });
});
```

就是再把所有任务跑一遍后启动实现live reload的`devServer`
修改文件时,gulp就会从`src`->`build`进行构建,而webpack则是检测着build文件夹是否有更新来进行增量编译,同时实现live reload

至此,已经把脑中想法基本实现了出来(其实并没有,bug多多的说)

## 写在最后

再来说说实践过后的想法
>webpack果真是业界杀鸡用牛刀的最佳代言人

好吧,可能是我接触webpack不久
在如此小的应用上,使用webpack真是一点都体会不出它的好处
(唯一一点可能就是es6的import语法而已,不过要使用import还是react或redux等等库的坑)
在大型项目使用可有成功案例,希望大家不吝指教一下^ ^~
另外一点,我还看过几篇比较gulp和webpack的博文(国内外都有)
大意其实都差不多,就是说,如果用gulp,你要写多很多代码,你将会有非常多的开发依赖balabala....
而用webpack,你就可以通过少量的代码解决这些问题等等等等的,
且不论`代码多少`的问题,这点我并没有实践过
但是再一次表明我的看法
>webpack和gulp/grunt就不是`一个职能`的工具,谈何取代?
至于代码多少的问题
有没有想过,`代码少`就真的一定`好`吗?
我认为,`gulp/grunt`或是`browserify/webpack`等等工具的面世,其实都是为了解决前端的`工程化问题`
在`工程化问题`面前,难道追求的真的是`write less, do more`吗?
举个例子,各种`MV**`的设计模式,真的有让大家`少写`很多代码吗?起码我并不觉得有那么一回事
我认为,付出适当的代价,组合使用各种工具,使用合适的工作流,才能真正起到管理前端工程的作用

至于何为`适当`,何为`合适`,依然需要探索

> 后记: 此文于年初发表于[segmentfault](https://segmentfault.com/a/1190000004249679)上,现在把一些文章迁移到博客上,重新看回这篇文章才
> 觉得当时的自己图样图森破,大家权当看个笑话,如果真能为大家带来什么新的视觉,那也是我的荣幸!