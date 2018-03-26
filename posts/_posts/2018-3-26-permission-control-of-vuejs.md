---
layout: post
title: "vuejs单页应用的权限管理实践"
description: "权限管理是很多B端应用无法避免的一个需求,在如今前后端分离的大潮下,纯单页应用应该如何在前端进行权限管理?"
date: 2018-03-26
tags: [front-end, vuejs]
comments: true
share: true
---

在众多的B端应用中,简单如小型企业的管理后台,还是大型的CMS,CRM系统,权限管理都是一个重中之重的需求,过往的web应用大多采取服务端模板+服务端路由的模式,权限管理自然也由服务端进行控制和过滤.但是在前后端分离的大潮下,如果采用单页应用开发模式的话,前端也无可避免要配合服务端共同进行权限管理,接下来会以vuejs开发单页应用为例,给出一些尝试方案,希望也能给大家提供一些思路.注意采用nodejs作为中间层的前后端分离不在此文讨论范围.

## 目标

关于权限管理,由于本人对服务端并不能算得上十分了解,我只能从我以往的项目经验中进行总结,并不一定十分准确.

一般权限管理分为以下几部分.

- 应用使用权
- 页面级别权限
- 模块级别权限
- 接口级别权限

接下来会逐一讲解上述部分.完整的实例代码托管在[github-funkyLover/vue-permission-control-demo](https://github.com/funkyLover/vue-permission-control-demo)上.

## 应用使用权-登录状态管理与保存

首先`应用使用权`其实就是简单的判断登录状态而已.在很多C段应用,登录之后能使用更多的功能在一定程度上也可以算作权限管理的一部分.而在B端应用中一般表现为不登录则不能使用(当然还能使用类似找回密码之类的功能).

以往登录状态的保持一般通过session+cookie/token管理,用户在打开网页时就带上cookie/token,由后端逻辑判断并进行重定向.在SPA的模式下,页面跳转是由前端路由进行控制的,用户状态的判断则需要由前端主动发送一次`自动登录`的请求,根据返回结果进行跳转.

这个`自动登录`的逻辑可以深挖做出多种实现,例如登录成功之后把用户信息加密并通过localstorage在多个tab之间公用,这样再新打开tab时就不需要再次`自动登录`.这里就以最简单的实现来进行讲解,基本流程如下: 

1. 用户请求页面资源
1. 检查本地cookie/localstorage是否有token
1. 如果没有token,不管用户请求打开的是哪个路由,都一律跳转到login路由
1. 如果检查到token,先请求`自动登录`的接口,根据返回的结果判断是进入用户请求的路由还是跳转到login路由

而关于用户状态的判断,一般应该针对`进行login路由`(包括忘记密码之类的路由)和`进入其他路由`进行判断,在基于vuejs@2.x的前提下,可以在router的beforeEach钩子上进行用户状态判断并切换路由即可.下面给出部分代码:

```js
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }, {
        path: 'page1',
        name: 'Page1',
        component: Page1
      }, {
        path: 'page2',
        name: 'Page2',
        component: Page2
      }
    ]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new Router({
  routes,
  mode: 'history'
  // 其他配置
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    // 当进入路由为login时,判断是否已经登录
    if (store.getters.user.isLogin) {
      // 如果已经登录,则进入功能页面
      return next('/')
    } else {
      return next()
    }
  } else {
    if (store.getters.user.isLogin) {
      return next()
    } else {
      // 如果没有登录,则进入login路由
      return next('/login')
    }
  }
})
```

在设定好跳转逻辑后,我们则需要在login路由中检查是否有token并进行自动登录

```js
// Login.vue
async mounted () {
  var token = Cookie.get('vue-login-token')
  if (token) {
    var { data } = await axios.post('/api/loginByToken', {
      token: token
    })
    if (data.ok) {
      this[LOGIN]()
      Cookie.set('vue-login-token', data.token)
      this.$router.push('/')
    } else {
      // 登录失败逻辑
    }
  }
},
methods: {
  ...mapMutations([
    LOGIN
  ]),
  async login () {
    var { data } = await axios.post('/api/login', {
      username: this.username,
      password: this.password
    })
    if (data.ok) {
      this[LOGIN]()
      Cookie.set('vue-login-token', data.token)
      this.$router.push('/')
    } else {
      // 登录错误逻辑
    }
  }
}
```

同理退出登录时把token置空即可.注意这里给出的逻辑实现相对粗糙,实际应该根据需求进行改动,例如在进行自动登录的时候给用户适当的提示,把读取/存储token的逻辑放进store中进行统一管理,处理token的过时逻辑等.

## 页面级别权限-根据权限生成router对象

这里可以借助[vue-router/路由独享的守卫](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html#%E8%B7%AF%E7%94%B1%E7%8B%AC%E4%BA%AB%E7%9A%84%E5%AE%88%E5%8D%AB)来进行处理.基本思路为在每一个需要检查权限的路由中设置beforeEnter钩子函数,并在其中对用户的权限进行判断.

```js

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }, {
        path: 'page1',
        name: 'Page1',
        component: Page1,
        beforeEnter: (to, from, next) => {
          // 这里检查权限并进行跳转
          next()
        }
      }, {
        path: 'page2',
        name: 'Page2',
        component: Page2,
        beforeEnter: (to, from, next) => {
          // 这里检查权限并进行跳转
          next()
        }
      }
    ]
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }
]
```

上面代码时足以完成需求的,再配合上[vue-router/路由懒加载](https://router.vuejs.org/zh-cn/advanced/lazy-loading.html)也可以实现对于没有权限的路由不会加载相应页面组件的资源.不过上述实现还是有一些问题.

1. 当页面权限足够细致时,router的配置将会变得更加庞大难以维护
1. 每当后台更新页面权限规则时,前端的判断逻辑也要跟着改变,这就相当于前后端需要共同维护一套页面级别权限.

第一个问题尚且可以通过编码手段来减轻,例如把逻辑放到beforeEach钩子中,又或者借助高阶函数对权限检查逻辑进行抽象.但是第二个问题却是无可避免的,如果把我们只在后端进行路由的配置,而前端根据后端返回的配置扩展router呢,这样就可以避免在前后端共同维护一套逻辑了,根据这个思路我们对之前逻辑进行一下改写.

```js
// Login.vue
async mounted () {
  var token = Cookie.get('vue-login-token')
  if (token) {
    var { data } = await axios.post('/api/loginByToken', {
      token: token
    })
    if (data.ok) {
      this[LOGIN]()
      Cookie.set('vue-login-token', data.token)
      // 这里调用更新router的方法
      this.updateRouter(data.routes)
    }
  }
},
// ...
methods: {
  async updateRouter (routes) {
    // routes是后台返回来的路由信息
    const routers = [
      {
        path: '/',
        component: Layout,
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: Dashboard
          }
        ]
      }
    ]
    routes.forEach(r => {
      routers[0].children.push({
        name: r.name,
        path: r.path,
        component: () => routesMap[r.component]
      })
    })
    this.$router.addRoutes(routers)
    this.$router.push('/')
  }
}
```

这样就实现了根据后端的返回动态扩展路由,当然也可以根据后端的返回生成侧栏或顶栏的导航菜单,这样就不需要再在前端处理页面权限了.这里还是要再提醒一下,本文的例子只实现最基本的功能,省略了很多可优化的逻辑

1. 每打开新的tab(非login路由)时都会重新`自动登录`并重新扩展router
1. 每打开新的tab,自动登录之后依然会跳转`/`路由,就算新打开的url为`/page1`

解决思路是把用户登录信息和路由信息存储在localstorage中,当打开新tab时直接通过localstorage中存储的信息直接生成router对象.借助[store.js](https://github.com/marcuswestin/store.js/)和[vuex-shared-mutations](https://github.com/xanf/vuex-shared-mutations)一类的插件可以一定程度上简化这部分逻辑,不过这里不展开讨论.

## 模块级别权限-组件权限

模块级别的权限很好理解,其实就是带权限判断的组件.在React中借助高阶组件来定义需要过滤权限的组件是非常容易且容易理解的.请看下面的例子

```js
const withAuth = (Comp, auth) => {
  return class AuthComponent extends Component {
    constructor(props) {
      super(props);
      this.checkAuth = this.checkAuth.bind(this)
    }

    checkAuth () {
      const auths = this.props;
      return auths.indexOf(auth) !== -1;
    }

    render () {
      if (this.checkAuth()) {
        <Comp { ...this.props }/>
      } else {
        return null
      }
    }
  }
}
```

上面的例子展示的就是有权限时展示该组件,没有权限时则隐藏组件们可以根据不同权限过滤需求来定义各种高阶组件来处理.

而在vuejs中可以使用通过render函数来实现

```js
// Auth.vue
import { mapGetters } from 'vuex'

export default {
  name: 'Auth-Comp',
  render (h) {
    if (this.auths.indexOf(this.auth) !== -1) {
      return this.$slots.default
    } else {
      return null
    }
  },
  props: {
    auth: String
  },
  computed: {
    ...mapGetters(['auths'])
  }
}
// 使用
<Auth auth="canShowHello">
  <Hello></Hello>
</Auth>
```

vuejs中的render函数提供完全编程的能力,甚至还能在render函数使用jsx语法,获得接近React的开发体验,详情参考[vuejs文档/渲染函数&jsx](https://cn.vuejs.org/v2/guide/render-function.html).

## 接口级别权限

接口级别的权限一般就与UI库关联不大,这里简单讲一下如何处理.

1. 首先从后端获取允许当前用户访问的Api接口的权限
1. 根据返回来的结果配置前端的ajax请求库(如axios)的拦截器
1. 在拦截器中判断权限,根据需求提示用户即可

```js
axios.interceptors.request.use((config) => {
  // 这里进行权限判断
  if (/* 没有权限 */) {
    return Promise.reject('no auth')
  } else {
    return config
  }
}, err => {
  return Promise.reject(err)
})
```

其实个人认为前端也不一定有必要对请求的api进行权限判断,毕竟接口不像路由,路由现在已经由前端来管理了,但是接口最终都需要通过服务器的校验.可以视需求加上.

## 后记

写得比较乱,像流水账似的,完整的实例代码在[github-funkyLover/vue-permission-control-demo](https://github.com/funkyLover/vue-permission-control-demo),如有问题或者意见请评论留言,我必虚心受教.
