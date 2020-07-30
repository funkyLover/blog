---
layout: post
title: "2020-07-24"
date: 2020-07-24
tags: [js, math]
comments: true
share: true
---

> [2020-07-30]mai拉取所有远程分支 <br>
> [2020-07-24]Math三角函数根据角度计算 <br>

##### [2020-07-30]mai拉取所有远程分支

```bash
git fetch --all
git branch -r | grep -v '\->' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
git pull --all
```

##### [2020-07-24]Math三角函数根据角度计算

因为 `Math.sin` 等三角函数的入参并不是角度, 而是弧度, 在需要使用角度计算时, 需要把弧度转化成角度

```js
const _sin = Math.sin;

Math.sin = function (deg) {
  return _sin( 30 * Math.PI / 180);
}
```
