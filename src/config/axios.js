import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import {ToastUtils} from "../utils/utils";

Vue.use(VueAxios, axios);
//使用cookie
Vue.axios.defaults.withCredentials = true;

// 添加响应拦截器
axios.interceptors.response.use(null,
  function (error) {
    // 全局拦截错误消息，显示错误信息
    if (error.message === "Network Error") {
      //判断有没有连接外网
      if (navigator.onLine) {
        //有则是服务器出错
        ToastUtils.error("服务器无响应，请联系维护人员检查服务器状态");
      } else {
        //无则是网络问题
        ToastUtils.error("请求失败，请检查网络连接");
      }
    } else {
      ToastUtils.error(error.response.data.msg);

      if (error.response.status === 401) {
        window.vue.$store.commit("logout")
        window.vue.$router.push("/login");
      }
      return Promise.reject(error);
    }
  });

