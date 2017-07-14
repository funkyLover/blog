---
layout: post
title: "git相关"
date: 2016-12-30
tags: [git]
comments: true
share: true
---

##### [16-10-17]ignore已经被git track的文件,并删除远程分支上对应的文件

```shell
git rm --cached file-name-should-be.ignote
git commit -m "删除文件"
# 别忘了改动.gitignore文件
```

##### [16-7-12]fork的项目如何与原项目的保持一致更新改动

在github上fork项目之后做了自己的改动,或会提交pull request给原项目,也有可能不会提交,但是是用fork的项目进行开发时,希望时刻能把原项目的更新到fork项目,可以用以下方法,看这个[stackover的问题](http://stackoverflow.com/questions/7244321/how-do-i-update-a-github-forked-repository)有更加详细的说明

```shell
# Add the remote, call it "upstream":
git remote add upstream https://github.com/whoever/whatever.git

# Fetch all the branches of that remote into remote-tracking branches,
# such as upstream/master:
git fetch upstream

# Make sure that you're on your master branch:
git checkout master

# Rewrite your master branch so that any commits of yours that
# aren't already in upstream/master are replayed on top of that
# other branch:
git rebase upstream/master
# push the update to your repo after resolve the CONFLICT
git push -f origin master
```

##### [16-7-10]以某一分支为基础创建新分支

```shell
git checkout -b branch_base_on_b1 b1
```


##### [16-5-28]避免merge commit

每次本地分支与远程分支发生冲突时,如果简单通过`git pull` -> `git push`的步骤来提交改动,不管两个版本有没有冲突,都会产生一个merge commit,一般来说,当两个版本直接没有冲突时,使用`git pull -rebase`就可以避免merge commit

关于使用`git pull -rebase`还有小技巧,详细可以看看[这篇文章](http://kernowsoul.com/blog/2012/06/20/4-ways-to-avoid-merge-commits-in-git/)
