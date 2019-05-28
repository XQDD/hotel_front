import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import store from '../config/store'
import Frame from "../components/Frame";
import Home from "../components/pages/Home";
import AddRoom from "../components/pages/room/AddRoom";
import RoomList from "../components/pages/room/RoomList";
//使用vueRouter路由
Vue.use(VueRouter)

let router = new VueRouter({
  mode: "hash",
  routes: [
    {path: '/login', component: Login},
    {
      path: '*', component: Frame, children: [
        {
          path: '/rooms',
          component: RoomList
        },
        {
          path: '/addRoom',
          component: AddRoom
        },
        {
          path: '/',
          component: Home
        },
      ]
    },
  ]
})

//vue-router导航守卫
//在每次路由变化前（页面跳转前）调用
router.beforeEach(function (to, from, next) {
    //更新页面过度动画
    store.commit("randomAnimation")
    //当跳转到非登录界面时
    if (to.fullPath !== "/login") {
      //要是未登录，跳转到登录页面
      if (!store.getters.isLogined) {
        next("login")
        return;
      }
    } else if (to.path === "/login") {
      //要是已登录，跳转到首页
      if (store.getters.isLogined) {
        next("/")
        return;
      }
    }
    next();
  }
)


//路由配置
export default router
