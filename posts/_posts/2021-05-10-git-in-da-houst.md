---
layout: post
title: "git疑难杂症解决日志"
description: "git疑难杂症解决日志"
date: 2021-05-10
tags: [git]
comments: true
share: true
---

纯笔记, 记录使用 git 的骚操作

## 查看哪些分支有该 commit 提交

```bash
git branch --contains <commit sha>
```

## 查看是在哪个分支提交的 commit

```bash
# 超过90天的Reflog会被git-gc删除, 所以只能查90天内的数据
git reflog show --all | grep <commit sha>
```

## 定位特定 commit 是从哪一个 merge commit 合到特性分支的

> from https://stackoverflow.com/questions/8475448/find-merge-commit-which-include-a-specific-commit

```bash
# ~/.gitconfig
[alias]
    find-merge = "!sh -c 'commit=$0 && branch=${1:-HEAD} && (git rev-list $commit..$branch --ancestry-path | cat -n; git rev-list $commit..$branch --first-parent | cat -n) | sort -k2 -s | uniq -f1 -d | sort -n | tail -1 | cut -f2'"
    show-merge = "!sh -c 'merge=$(git find-merge $0 $1) && [ -n \"$merge\" ] && git show $merge'"

git find-merge <commit sha>

git find-merge <commit sha> master
```

## 查看某一分支的创建时间

```bash
git reflog show --date=iso <barnch name>
```

## error: cannot lock ref

git pull时遇到 `error: cannot lock ref` 错误, 大概率是分支命名(如大小写)问题冲突导致

```bash
git update-ref -d refs/remotes/origin/xxxx
```

目前还没完全理解 update-ref, 可翻阅[相关文档](https://www.bookstack.cn/read/git-doc-zh/docs-81.md)
