import Vue from "vue";
import Vuex from "vuex";
import {urls} from "../constans/urls";
import {animations} from "../constans/others";

Vue.use(Vuex);

//初始化分店
const branch = localStorage.getItem("branch") || 0;
// 设置axios base url
let setAxiosBaseUrl = (branch) => Vue.axios.defaults.baseURL = urls[branch].baseURL;
setAxiosBaseUrl(branch);

//随机动画
let randomAnimation = () => "animated faster " + animations[Math.floor(Math.random() * 0)]

export default new Vuex.Store({
  strict: true,
  state: {
    //用户登录数据
    user: localStorage.getItem("user"),
    //当前是哪家分店
    branch,
    //当前登录用户所拥有的权限
    permissions: {},
    //当前随机动画效果
    randomAnimation: randomAnimation()
  },
  mutations: {
    switchBranch: (state, {branch}) => {
      state.branch = branch
      localStorage.setItem("branch", branch)
      setAxiosBaseUrl(branch)
    },
    login: (state, {user}) => {
      state.user = user
      state.permissions = user.roles.flatMap(r => r.permissions.map(p => p.permission))
      localStorage.setItem("user", user)
    },
    logout: (state) => {
      state.user = null;
      state.permissions = {}
      localStorage.removeItem("user")
    },
    randomAnimation: (state) => {
      state.randomAnimation = randomAnimation();
    }
  },
  actions: {},
  getters: {
    isLogined: state => state.user != null,
    url: state => urls[state.branch],
  }
});
