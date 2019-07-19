
# mac下如果取消各种软件的dark-mode(macOS Mojave)

## Microsoft Office系列

解决方案来自 [一鍵將 Office 2019 macOS 暗化黑色主題改回白色主題風格技巧](https://mrmad.com.tw/office-for-mac-2019-disable-dark-mode)

```bash
# word
defaults write com.microsoft.Word NSRequiresAquaSystemAppearance -bool yes

# outlook
defaults write com.microsoft.Outlook NSRequiresAquaSystemAppearance -bool yes

# execl
defaults write com.microsoft.Excel NSRequiresAquaSystemAppearance -bool yes

# ppt
defaults write com.microsoft.Powerpoint NSRequiresAquaSystemAppearance -bool yes

# 最后运行, 然后重启
killall cfprefsd
```

如果想从白色主题再回到黑色主题

```bash
# word
defaults write com.microsoft.Word NSRequiresAquaSystemAppearance -bool no

# ppt
defaults write com.microsoft.Powerpoint NSRequiresAquaSystemAppearance -bool no

# execl
defaults write com.microsoft.Excel NSRequiresAquaSystemAppearance -bool no

# outlook
defaults write com.microsoft.Outlook NSRequiresAquaSystemAppearance -bool no

# 最后运行, 然后重启
killall cfprefsd
```

不过有个问题, outlook之前的版本样式是大部分区域都是深色, 只有邮件内容区域是亮色, 后面才改成全深色

通过上面的设置没办法设置成`大部分区域都是深色, 只有邮件内容区域是亮色`的样式, 只能是全深色或全亮色
