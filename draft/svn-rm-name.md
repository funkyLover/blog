# svn rm name

使用命令批量删除 Miss file 时, 发现文件名中出现空格, 导致错误问题

```bash
svn st | grep ! | cut -d! -f2| sed 's/^ *//' | sed 's/^/\"/g' | sed 's/$/\"/g' | xargs svn rm
```
