---
layout: post
title: "elasticsearch学习笔记"
description: "被业务赶着走, 没有深入浅出地学习, 只是简单记录一些问题"
date: 2020-11-19
tags: [elasticsearch]
comments: true
share: true
---

被业务赶着走, 没有深入浅出地学习, 只是简单记录业务上遇到的一些问题

## 分页

es 中有三种分页模式, 分别是 `from+size`, `scroll` 和 `size-from`

### from + size

其实就是偏移(from) n 条记录, 取(size) m 条记录

假设有 5 个分片, 一个 `from=100&size=10` 的查询, 实际是从 5 个分片分片查出 110 条总共 550 记录, 然后对这 550 记录进行排序, 返回处于 100-110 位置的 10 条记录, 然后丢弃掉 540 条记录

### scroll

类似数据库的游标, 但是不建议用于实时数据的查询, 因为 scroll 查询会生成 scroll_id 并缓存, 还会生成历史快照且对于数据的变更不会反映到快照上, 需要耗费一定资源的, 而且也不适用于有跳页的场景

### search_after

类似 scroll, 但是可用于实时数据的查询, 如果索引数据有增删改查的变更, 这些变更也会实时的反映到游标上, 但同样的不适用有跳页的场景

## query vs filter

简单来说, `query` 是针对全部记录进行匹配, 除了查询文档是否匹配之外, 还会计算一个\_score, \_score 表示文档相对于其他文档的匹配程度

`filter` 只会判断结果是否是否符合查询条件, 性能比 `query` 更快, 如果一个查询包含`query` 和 `filter`, es 会先执行 `filter` 筛选出符合条件记录, 然后再执行 `query` 进行匹配

## 排序优化

但我们使用业务字段进行排序时, 排序字段有相同值的记录, 查询的排序结果可能并不一致

例如根据 age 排序, A B C 三条记录 age 都是 18, 第一次查询可能结果为 A B C, 第二次查询可能结果为 B A C

故如果需要唯一排序顺序, 建议增加 ES 记录唯一 id 排序条件, 或根据业务情况增加业务字段排序

例如业务需求根据 age 排序, 查询时可以用 [age, id] 的组合排序条件

## nested 结构

举例有如下结构数据

```json
[
  {
    "name": "a",
    "id": 1,
    "comments": [
      {
        "content": "haha",
        "type": 1
      },
      {
        "content": "hehe",
        "type": 2
      }
    ]
  },
  {
    "name": "b",
    "id": 2,
    "comments": [
      {
        "content": "hehe",
        "type": 1
      }
    ]
  }
]
```

当我们要查询出来 `comments` 中包含一条 `content为hehe, 且type为1` 的用户

如果用以下的查询方式, 会发现 `name为a` 这个不满足条件的数据也会被查询出来

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "comments.content": "hehe" // a.comments[1].content 满足 content为hehe 的查询条件
          }
        },
        {
          "term": {
            "comments.type": 1 // a.comments[2].content 满足 type为1 的查询条件
          }
        }
      ]
    }
  }
}
```

如果我们希望查出来的数据应该只有 `b`, 这个时候就需要使用 nested 结构, 再来修改我们的查询语句如下, `a` 则不会被查询出来

```json
{
  "query": {
    "bool": {
      "nested": {
        "path": "comments",
        "query": {
          "bool": {
            "must": [
              {
                "term": {
                  "comments.content": "hehe"
                }
              },
              {
                "term": {
                  "comments.type": 1
                }
              }
            ]
          }
        }
      }
    }
  }
}
```
