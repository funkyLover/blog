---
layout: post
title: "typescript勿忘笔记"
description: "纯笔记, 记录使用 typescript 中遇到的问题及相关解决方案"
date: 2021-04-25
tags: [typescript]
comments: true
share: true
---

纯笔记, 记录使用 typescript 中遇到的问题及相关解决方案

## 实用类型工具

再使用 typescript 初期, 最让我头疼的就是类型的声明定义

经常出现的情况是, 我们针对一个业务场景定义了一个类型, 后面又发现各个场景又会使用到和该类型相近而又不完全相同的类型

虽然采用重复定义类型的方案来解决, 但这种解决方法实在是愚蠢, 而且这种痛点感觉大家应该都会遇到才对, 那 typescript 是不是也有对应的解决方案?

最后搜到 typescript 其实提供了非常多的类型工具, 供我们方便对现有类型进行操作

- Partial

  返回一个新类型, 将类型定义的所有属性都修改为可选

  ```ts
  interface User {
    id: string;
    name: string;
    gender: string;
  }
  let user: Partial<User> = {};

  if (xxx) {
    user.name = "xxx";
  }
  ```

- Omit

  剔除类型中的某些属性，创建一个新的对象类型

  ```ts
  interface User {
    id: string;
    name: string;
    gender: string;
  }

  let user: Omit<User, "name"> = { id: xxx, gender: "男" };
  ```

- ReturnType

  获取方法的返回值类型

  ```ts
  const funcNumber = (val: number) => val;
  const funcString = (val: string) => string;

  let val: ReturnType<typeof func> | ReturnType<typeof funcString> = "";

  if (xxx) {
    val = funcNumber();
  } else {
    val = funcString();
  }
  ```

## 自定义类型工具

- 获取 Promise 类型

  from https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise

  ```ts
  function promiseOne() {
    return Promise.resolve(1);
  }

  const promisedOne = promiseOne();

  // note PromiseLike instead of Promise, this lets it work on any thenable
  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

  type PromiseOneThenArg = ThenArg<typeof promisedOne>; // => number
  // or
  type PromiseOneThenArg2 = ThenArg<ReturnType<typeof promiseOne>>; // => number
  ```
