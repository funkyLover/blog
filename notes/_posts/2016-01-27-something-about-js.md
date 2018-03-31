---
layout: post
title: "2016-01-27"
date: 2016-01-27
tags: [nodejs, redux, npm]
comments: true
share: true
---

> [18-03-09]如何在reducer中获取另一个reducer的state值(redux) <br>
> [16-06-13]使用http-proxy-middleware时cookie没有被正确设置 <br>
> [16-02-24]最方便的求数组和,数组最小值,最大值 <br>
> [16-01-27]npm install的进度条会影响速度 <br>
> [16-01-18]去除字符串中的空格 <br>

##### [18-03-09]如何在reducer中获取另一个reducer的state值(redux)

1. 首先检查确认reducer边界正确,让职责分离,看是否需要重新规划store状态树结构.
1. 通过根据需求自定义action和root reducer规则,例如使用[reduce-reducers](https://github.com/redux-utilities/reduce-reducers)和[redux-actions](https://github.com/redux-utilities/redux-actions)而非combineReducers,如果一定要使用combineReducers,可以采取`combineReducers({ D: combineReducers({A,B,C}), E })`的方式,不过这样就另store结构更加复杂了
1. 比较简单无脑的做法是,把reducer需要的state注入到dispatch action的组件中,然后作为action的参数值传递到对应的reducer中.
1. 使用类似redux-thunk的中间件,这样就可以在dispatch之前用`getState()`方法获取需要的state.

##### [16-06-13]使用http-proxy-middleware时cookie没有被正确设置

详细讨论在[chimurai/http-proxy-middleware#78](https://github.com/chimurai/http-proxy-middleware/issues/78)

```js
const proxyOptions = {
  onProxyReq: relayRequestHeaders,
  onProxyRes: relayResponseHeaders
}
function relayRequestHeaders(proxyReq, req) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key]);
  });
}
function relayResponseHeaders(proxyRes, req, res) {
  Object.keys(proxyRes.headers).forEach(function (key) {
    res.append(key, proxyRes.headers[key]);
  });
}
```

##### [16-02-24]最方便的求数组和,数组最小值,最大值

```js
var nums = [1, 2, 3, 4, 5, 6, 7, 8]
var sum1 = eval(nums.join('+')) // note: eval is evil!
var sum2 = nums.reduce(function (pre, next) { return pre + next }, 0)
var min = Math.min.apply(Math, nums) // Math.min(...nums) ES6
var max = Math.max.apply(Math, nums) // 同上
```

##### [16-01-27]npm install的进度条会影响速度

非常热烈的讨论[npm/npm#11283](https://github.com/npm/npm/issues/11283)

```shell
# 禁止install时的进度条
npm set progress=false
npm install --progress=true
# 或使用 alias
alias ni="npm install --progress=false"
```

##### [16-01-18]去除字符串中的空格

```js
var str = 'i am a string contain white space'
var strTrimed1 = str.split(' ').join('')
var strTrimed2 = str.replace(/\s+/g, '');
```
