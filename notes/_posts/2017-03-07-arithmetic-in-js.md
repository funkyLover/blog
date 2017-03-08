---
layout: post
title: "那些年做过的算法题"
date: 2017-03-01
tags: [算法]
comments: true
share: true
---

##### 查询数组中有没有比它前面元素都大,比它后面的元素都小的数

> 一个整数的数组例如int a[]={21,11,45,56,9,66,77,89,78,68,100,120,111}  
> 查询数组中有没有比它前面元素都大,比它后面的元素都小的数,没有打印-1,有显示其索引
> 额外条件,时间及空间复杂度都为O(n)

```js

function find (array) {
  if (!array || !Array.isArray(array) || array.length === 0) return -1;

  var result = {}
  var record = []
  var length = array.length
  var current = array[0]  

  for (var i = 0; i < length; i++) {
    if (array[i] >= current) {
      record.push(array[i])
      current = array[i]
    } else {
      record.push(current)
    }
  }
  console.log(record)

  current = array[length - 1]

  for (var j = length - 1; j >= 0; j--) {
    if (array[j] <= current && array[j] >= record[j]) {
      result[array[j]] = j
    }
    if (current >= array[j]) {
      current = array[j]
    }
  }

  for (props in result) {
    return result
  }
  return -1
}

```

##### 给定数组array,让数组元素从左到右偏移长度值n,末尾元素偏移到首部,如此循环

> 假设给定数组array = [1, 2, 3, 4, 5, 6]及长度3,使原数组为[4, 5, 6, 1, 2, 3]

```js

function toRigth(array, n) {
  var length = array.length
  var offset = n % length
  if (n === 0 || offset === 0) return array
  
  /*
  快速实现
  for (var i = 0; i < offset; i++) {
    array.unshift(array.pop())
  }
  */

  // 额外条件,不借用array方法,不增加额外的内存消耗
  // 未完待续
}

```
