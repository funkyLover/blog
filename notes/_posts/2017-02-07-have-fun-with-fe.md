---
layout: post
title: "趣题详解"
date: 2016-12-30
tags: [unity]
comments: true
share: true
---

###### Q: 写出javascript运行结果

```js
for(var i=0; i<10; i++){} alert(i); 
```

A: 弹出提示10,因为javascript中没有块状作用域(ES6的let,const关键字除外)

###### Q: 以下代码的运行结果

```js
var a = {n: 1}  
var b = a;  
a.x = a = {n: 2}  
console.log(a.x);  
console.log(b.x);
```

A: 

```js
console.log(a.x); // undefined
console.log(b.x); // {n: 2}
```

实际是一个堆内存和占内存的问题,b是一个指向一个堆内存地址的指针,而a在`a={n:2}`时就指向了新的地址,而内容是`{n:2}`自然a.x就为undefined了

###### Q: 创建一个1-100的数组，按顺序递增

A: 方法蛮多的,这种题不考虑循环还是有很多解法,例如循环的好基友递归

```js
function createArray(count, array) {
  array = array || []
  if (count <= 0) {
    return array
  } else {
    array[count-1] = count
    return createArray(count-1, array)
  }
}
```

写起来才发现,还是循环好用啊!当然ES6你还能这样`[...Array(100)].map((val,index)=>index+1)`,不过使用map函数与循环并没有太大区别

###### Q: 下列代码运行结果

```js
var name = 'Hello'

var a = {
  name: 'a',
  getFunction: function () {
    this.name = 'aInside'
    return function () {
      return this.name
    }
  }
}

var b = {
  name: 'b',
  getFunction: function () {
    var that = this
    return function () {
      that.name = 'bInside'
      return that.name
    }
  }
}
console.log(a.getFunction()())
console.log(b.getFunction()())
```

A: 比较简单的闭包问题,第1层的函数的this是各自的对象(a/b),当调用a.getFunction()(或者b.getFunction())时得到一个方法,此时再调用这个方法则是在window作用域下,所以函数内部的this指向window,而b.getFunction()返回的函数内部应用了上层作用域的that变量,所以输出为

```js
console.log(a.getFunction()()) // hello
console.log(b.getFunction()()) // bInside
```

###### Q: 有一个长度为100的数组，请以优雅的方式求出该数组的前10个元素之和

A: 看数组API的熟悉,可以这样

```js
var array = [...Array(100)].map((val,index)=>index+1)
var sum10 = array.slice(0, 10).reduce((pre, next) => pre + next)
console.log(sum10)
// 不优雅的做法
console.log(eval(array.slice(0, 10).join('+')))
```
