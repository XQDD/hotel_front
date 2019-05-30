/**
 * 入口脚本文件，进行初始化vue相关工作
 */
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from "./components/App"
//使用axios，接口调用工具，注意此处导入应先于store，因为store中要配置axios
import "./config/axios"
//全局状态管理
import store from "./config/store";
//路由管理
import router from "./config/router"
//表单校验框架
import Vuelidate from 'vuelidate'
//使用animation.css库
import 'animate.css'
//使用FontAwesomeIcon图标库
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
//全局注册组件，将font-awesome-icon标签变成可用
Vue.component('font-awesome-icon', FontAwesomeIcon)
//使用vuelidate表单校验框架
Vue.use(Vuelidate)
//关闭开发vue提示
// Vue.config.productionTip = false
//使用bootstrap
Vue.use(BootstrapVue);

window.vue = new Vue({
  //单页面路由规则配置
  router: router,
  //使用vuex状态管理
  store: store,
  //渲染模板
  render: render => render(App),
  //index.html中的id
  el: "#app"
});

