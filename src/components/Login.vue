<template>
  <b-container class="h-100 d-flex flex-column login-container" fluid>
    <b-row align-h="center" class="mt-4 font-weight-bold" style="font-size: 2rem;color: white">
      XX酒店管理系统
    </b-row>
    <b-row align-v="center" style="flex:1">
      <b-col>
        <b-carousel>
          <b-carousel-slide img-src="../assets/images/login_hotel1.png"/>
          <b-carousel-slide img-src="../assets/images/login_hotel2.jpg"/>
          <b-carousel-slide img-src="../assets/images/login_hotel3.jpg"/>
        </b-carousel>
      </b-col>
      <b-col>
        <b-card style="background-color:#ced4da;padding: 1.5rem 1.2rem 1rem 1.2rem">
          <b-form @submit.prevent="onSubmit">

            <FormInput
              :field="$v.form.name"
              :server-error="serverErrors.name"
              label="账号"
              placeholder="请输入账号"
              error="账号不能为空"
              :submitting="submitting"
            />

            <FormInput
              :field="$v.form.password"
              :server-error="serverErrors.password"
              label="密码"
              placeholder="请输入密码"
              error="密码不能为空"
              type="password"
              :submitting="submitting"
            />

            <b-form-group label="选择服务器" label-cols-sm="2">
              <b-form-select v-model="branch" :options="branches" @change="updateCaptcha"></b-form-select>
            </b-form-group>

            <FormInput
              :field="$v.form.captcha"
              :server-error="serverErrors.captcha"
              label="验证码"
              placeholder="请输入验证码"
              error="验证码不能为空"
              :submitting="submitting"
            />
            <div class="d-flex flex-row justify-content-center mr-auto">
              <b-img @click="updateCaptcha" :src="captchaUrl" alt="验证码"></b-img>
            </div>

            <div class="d-flex flex-row justify-content-center my-1">
              <b-button :disabled="$v.form.$invalid" type="submit" variant="primary"
                        :style="{cursor:$v.form.$invalid?'not-allowed':''}">
                登录
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>


    </b-row>

  </b-container>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import {urls} from "../constans/urls";
  import FormInput from "./form/FormInput.vue"

  let getCaptchaUrl = (branch) => urls[branch].baseURL + "/user/getCaptcha?" + Math.random();

  export default {
    components: {FormInput},
    data() {
      return {
        //表单状态
        form: {
          name: null,
          password: null,
          captcha: null,
        },
        //服务器返回的校验数据
        serverErrors: {},
        captchaUrl: getCaptchaUrl(this.$store.state.branch),
        submitting: false,
      }
    },
    //校验
    validations: {
      form: {
        name: {required},
        captcha: {required},
        password: {required},
      }
    },
    methods: {
      //登录按钮
      onSubmit() {
        //更新表单提交状态
        this.submitting = true;
        //发送登录请求
        this.axios.get("/user/login", {params: {...this.form}}).then(r => {
          //登录成功，commit登录到store
          this.$store.commit("login", {user: r.data.data})
          //跳转到首页
          this.$router.push("/")
        }).catch(({response}) => {
          //登录失败
          //更新验证码
          this.updateCaptcha();
          if (response.data.data) {
            //出错后设置表单验证为c初始状态
            this.$v.$reset()
            //更新服务器校验错误信息
            this.serverErrors = response.data.data
          }
        })
        //更新表单提交状态
          .finally(() => this.submitting = false)
      },
      updateCaptcha() {
        this.captchaUrl = getCaptchaUrl(this.$store.state.branch);
      }
    },
    computed: {
      //服务器列表
      branches() {
        return urls.map((v, k) => {
          return {text: v.name, value: k}
        });
      },
      //当前选择的服务器
      branch: {
        get() {
          return this.$store.state.branch
        },
        set(branch) {
          this.$store.commit('switchBranch', {branch})
        }
      }
    }
  }
</script>

<style scoped>
  .login-container {
    padding-left: 6rem;
    padding-right: 6rem;
    background-image: url("../assets/images/login_background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
