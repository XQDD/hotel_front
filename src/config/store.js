import Vue from "vue";
import Vuex from "vuex";
import {urls} from "../constans/urls";

Vue.use(Vuex);

//初始化服务器选择
const branch = localStorage.getItem("branch") || 0;
// 设置axios base url
let setAxiosBaseUrl = (branch) => Vue.axios.defaults.baseURL = urls[branch].baseURL;
setAxiosBaseUrl(branch);

//随机动画
let randomAnimation = () => "animated faster zoomIn"

let localStoreUser = JSON.parse(localStorage.getItem("user"));
let getPermissions = user => user.roles.flatMap(r => r.permissions.map(p => p.permission));
export default new Vuex.Store({
  strict: true,
  state: {
    //用户登录数据
    user: localStoreUser,
    //当前是哪个服务器
    branch,
    //当前登录用户所拥有的权限
    permissions: localStoreUser ? getPermissions(localStoreUser) : [],
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
      state.permissions = getPermissions(user)
      localStorage.setItem("user", JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null;
      state.permissions = []
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
