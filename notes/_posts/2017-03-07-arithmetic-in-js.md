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
  if (!array || !Array.isArray(array) || array.length === 0) return -1

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

##### 给定数组array,让数组元素循环右移长度值n

> 假设给定数组array = [1, 2, 3, 4, 5, 6]及偏移量3,使原数组为[4, 5, 6, 1, 2, 3]

```js

function toRight(array, n) {
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
  reverse(array, 0, length - offset - 1)
  reverse(array, length - offset,  length - 1)
  reverse(array, 0, length - 1)

  return array
}

function reverse (array, begin, end) {
  var temp = null
  for (;begin < end; begin++, end--) {
    temp = array[end]
    array[end] = array[begin]
    array[begin] = temp
  }
}

```

##### 快速排序

> 经典排序算法

```js

// 简单实现, 需要额外内存
function quick (array) {

  if (!array || !Array.isArray(array) || array.length === 0) return []
  if (array.length === 1) return array
  var left = []
  var right = []
  var middle = []

  var key = array[0]

  for (var i = 0; i < array.length; i++) {
    if (array[i] < key) {
      left.push(array[i])
    } else if (array[i] > key) {
      right.push(array[i])
    } else {
      middle.push(array[i])
    }
  }

  return quick(left).concat(middle, quick(right))
}

// 经典实现, 不占用额外内存

```

##### 有两个从小到大排列的数组A和B,判断B数组是不是A数组的子集(可能有重复元素)

> 额外条件: 不使用额外内存

```js

function isSubset (A, B) {
  if (A.length === 0 && B.length === 0) return true
  if (A.length < B.length) return false

  for (var i = 0, j = 0; i < A.length && j < B.length;) {
    if (A[i] === B[j]) {
      i++
      j++
    } else if (A[i] < B[j]) {
      i++
    } else {
      return false
    }
  }

  if (j < B.length) return false

  return true
}

```
