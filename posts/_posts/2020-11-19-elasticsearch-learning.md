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

es中有三种分页模式, 分别是 `from+size`, `scroll` 和 `size-from`

### from + size

其实就是偏移(from) n 条记录, 取(size) m 条记录

假设有5个分片, 一个 `from=100&size=10` 的查询, 实际是从5个分片分片查出110条总共550记录, 然后对这550记录进行排序, 返回处于100-110位置的10条记录, 然后丢弃掉540条记录

### scroll

类似数据库的游标, 但是不建议用于实时数据的查询, 因为scroll查询会生成scroll_id并缓存, 还会生成历史快照且对于数据的变更不会反映到快照上, 需要耗费一定资源的, 而且也不适用于有跳页的场景

### search_after

类似scroll, 但是可用于实时数据的查询, 如果索引数据有增删改查的变更, 这些变更也会实时的反映到游标上, 但同样的不适用有跳页的场景

## query vs filter

简单来说, `query` 是针对全部记录进行匹配, 除了查询文档是否匹配之外, 还会计算一个_score, _score表示文档相对于其他文档的匹配程度

`filter` 只会判断结果是否是否符合查询条件, 性能比 `query` 更快, 如果一个查询包含`query` 和 `filter`, es 会先执行 `filter` 筛选出符合条件记录, 然后再执行 `query` 进行匹配
