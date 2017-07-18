//main.js将会作为我们应用的入口文件
// App.vue 会作为我们应用的初始化组件
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router/index'

import Vuex from 'vuex'
import axios from 'axios'
import store from './vuex/store'

// import * as filters from './util/filter'

// Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //注册过滤器


Vue.prototype.$axios = axios

Vue.use(Vuex)


import { ConfirmPlugin,LoadingPlugin,AlertPlugin, ToastPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)



Vue.use(VueRouter)

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
 mode:'history',  /*使用history模式，url为正常的模式，没有#*/
  scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为
  routes
})

//解决移动浏览器300ms延时问题
FastClick.attach(document.body)


router.beforeEach((to, from, next) => {
　// to: 即将要进入的路由对象
　// from: 当前正要离开的路由对象
　// next: 进行下一状态，切记，一定要在结束业务逻辑后调用 next 函数，不然钩子函数就不会被 resolved
  store.dispatch('setLoadingState', true)  
 if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next();
  }
})

router.afterEach(function (to) {
  store.dispatch('setLoadingState', false)
})

Vue.config.productionTip = false

//4. 创建和挂载根实例。
/* eslint-disable no-new */
new Vue({
  router,
    store,
  render: h => h(App)
}).$mount('#app-box')
