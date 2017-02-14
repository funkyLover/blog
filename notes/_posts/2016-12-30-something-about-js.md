---
layout: post
title: "nodejs & 无关前端业务js"
date: 2016-12-30
tags: [javascript]
comments: true
share: true
---

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
