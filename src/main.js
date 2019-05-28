import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from "./components/App"
//使用axios，注意此处导入应先于store，因为store中要配置axios
import "./config/axios"
import store from "./config/store";
import router from "./config/router"
import Vuelidate from 'vuelidate'
//使用animation.css库
import 'animate.css'
//使用FontAwesomeIcon图标库
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

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

