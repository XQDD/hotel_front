import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import store from '../config/store'
import Frame from "../components/Frame";
import Home from "../components/pages/Home";
import AddRoom from "../components/pages/room/AddRoom";
import RoomList from "../components/pages/room/RoomList";
import AddRoomRecord from "../components/pages/room_record/AddRoomRecord";
import RoomRecordList from "../components/pages/room_record/RoomRecordList";
import AddCustomer from "../components/pages/customer/AddCustomer";
import CustomerList from "../components/pages/customer/CustomerList";
import AddSysUser from "../components/pages/sys_user/AddSysUser";
import SysUserList from "../components/pages/sys_user/SysUserList";
import RoleList from "../components/pages/sys_user/RoleList";
//使用vueRouter路由
Vue.use(VueRouter)

let router = new VueRouter({
  mode: "hash",
  routes: [
    //登录
    {path: '/login', component: Login},
    {
      path: '*', component: Frame, children: [
        //客房
        {
          path: '/rooms',
          component: RoomList
        },
        {
          path: '/addRoom',
          component: AddRoom
        },
        //客房记录
        {
          path: '/addRoomRecord',
          component: AddRoomRecord
        },
        {
          path: '/roomRecords',
          component: RoomRecordList
        },
        //客户
        {
          path: '/addCustomer',
          component: AddCustomer
        },
        {
          path: '/customers',
          component: CustomerList
        },
        //系统用户
        {
          path: '/addSysUser',
          component: AddSysUser
        },
        {
          path: '/sysUsers',
          component: SysUserList
        },
        {
          path: '/roles',
          component: RoleList
        },
        //首页
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
