<template>
  <b-container style="margin-top: 5rem;width: 50%;min-width: 30rem" fluid>
    <b-form @submit.prevent="onSubmit">
      <FormInput
        :field="$v.form.name"
        :server-error="serverErrors.name"
        label="账号名称"
        placeholder="请输入账号名称"
        error="账号名称不能为空"
        label-length="3"
        :submitting="submitting"
      />

      <FormInput
        :field="$v.form.password"
        :server-error="serverErrors.password"
        label="密码"
        placeholder="请输入密码"
        error="密码不能为空"
        label-length="3"
        :submitting="submitting"/>

      <b-form-group
        :label-cols-sm="3"
        label="角色">
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInY"
                  v-for="(v,k) in roles" pill
                  @click="toggleRole(v.id)"
                  :variant="(form.roles.findIndex(r => r.id === v.id)<0?'outline-':'')+'warning'" :key="k">
          {{v.name}}
        </b-button>
      </b-form-group>


      <b-form-group
        label-cols-sm="3"
        label="头像">
        <b-form-file @change="uploadImage" capture accept="image/*" v-model="img" browse-text="上传头像"
                     placeholder="未选择头像">
          <template v-if="img" slot="file-name">
            <b-badge variant="dark">{{ img.name }}</b-badge>
          </template>
        </b-form-file>
        <vue-previewer v-if="form.icon" @onRemove="removeImage"
                       :imgs="[{src:$store.getters.url.baseUploadURL+form.icon}]"></vue-previewer>
      </b-form-group>


      <div class="d-flex flex-row justify-content-center my-1">
        <b-button :disabled="$v.form.$invalid" @click="onSubmit" variant="primary"
                  :style="{cursor:$v.form.$invalid?'not-allowed':''}">
          {{form.id?"修改":"添加"}}
        </b-button>
      </div>
    </b-form>

  </b-container>
</template>

<script>
  import FormInput from "../../form/FormInput"
  import {required} from 'vuelidate/lib/validators'
  import VuePreviewer from 'vue-preview-deleter'
  import Vue from "vue";
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {faPlus} from '@fortawesome/free-solid-svg-icons'
  import {ToastUtils} from "../../../utils/utils";

  library.add(faPlus);
  Vue.use(VuePreviewer);

  export default {
    created() {
      //获取角色列表
      this.axios.get("/user/getAllRole").then(response => {
        this.roles = response.data.data;
      })

      //数据回显
      let id = this.$route.query.id;
      if (id) {
        this.form.id = id;
        this.axios.get("/user/detail", {params: {sysUserId: id}}).then(response => {
          this.form = {...response.data.data, password: null}
        })
      }
    },
    components: {
      FormInput
    },
    data() {
      return {
        //表单数据
        form: {
          id: null,
          name: null,
          password: null,
          icon: null,
          roles: []
        },
        //服务器错误
        serverErrors: {},
        //是否表单提交中
        submitting: false,
        roles: [],
        img: null
      }
    },
    validations: {
      form: {
        name: {required},
        password: {},
      }
    },
    methods: {
      onSubmit(e) {
        if (!(e instanceof MouseEvent)) return;
        //更新表单提交状态
        this.submitting = true;
        this.axios.post("/user/save", this.form).then(r => {
          ToastUtils.success(r.data.msg);
          //TODO 演示时去除注释
          // this.$router.push("/users")
        }).catch(({response}) => {
          if (response.data.data) {
            //出错后设置表单验证为初始状态
            this.$v.$reset()
            //更新服务器校验错误信息
            this.serverErrors = response.data.data
          }
        })
        //更新表单提交状态
          .finally(() => this.submitting = false)
      },
      toggleRole(id) {
        let index = this.form.roles.findIndex(r => r.id === id);
        if (index < 0) {
          this.form.roles.push({id})
        } else {
          this.form.roles.splice(index, 1)
        }
      },
      //上传图片
      uploadImage() {
        Vue.nextTick().then(() => {
          if (this.img) {
            let formData = new FormData();
            formData.append("files", this.img)
            this.axios.post("/common/upload", formData).then(r => {
              this.form.icon = r.data.data[0]
            })
          }
        })
      },
      //移除图片
      removeImage() {
        this.form.icon = null;
      }
    },
  }
</script>

<style scoped>
</style>
