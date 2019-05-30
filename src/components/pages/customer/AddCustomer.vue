<template>
  <b-container style="margin-top: 5rem;width: 50%;min-width: 30rem" fluid>
    <b-form @submit.prevent="onSubmit">


      <FormInput
        :field="$v.form.name"
        :server-error="serverErrors.name"
        label="客户姓名"
        placeholder="请输入客户姓名"
        error="客户姓名不能为空"
        label-length="3"
        :submitting="submitting"
      />


      <b-form-group
        :label-cols-sm="3"
        label="客户性别">
        <b-form-radio-group
          style="display: flex;align-items: center;height: 100%"
          v-model="form.sex">
          <b-form-radio value="男">男</b-form-radio>
          <b-form-radio value="女">女</b-form-radio>
        </b-form-radio-group>
      </b-form-group>


      <FormInput
        :field="$v.form.phoneNumber"
        :server-error="serverErrors.phoneNumber"
        label="客户电话"
        placeholder="请输入客户电话"
        error="客户电话不能为空"
        label-length="3"
        :submitting="submitting"
      />


      <FormInput
        :field="$v.form.identification"
        :server-error="serverErrors.identification"
        label="客户身份证"
        placeholder="请输入客户身份证"
        error="客户身份证不能为空"
        label-length="3"
        :submitting="submitting"
      />


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
  Vue.use(VuePreviewer)


  export default {
    created() {
      //数据回显
      let id = this.$route.query.id;
      if (id) {
        this.form.id = id;
        this.axios.get("/customer/detail", {params: {customerId: id}}).then(response => {
          this.form = response.data.data
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
          phoneNumber: null,
          identification: null,
          sex: '男'
        },
        //服务器错误
        serverErrors: {},
        //是否表单提交中
        submitting: false,
      }
    },
    validations: {
      form: {
        name: {required},
        phoneNumber: {required},
        identification: {required},
      }
    },
    methods: {
      onSubmit(e) {
        if (!(e instanceof MouseEvent)) return;
        //更新表单提交状态
        this.submitting = true;
        this.axios.post("/customer/save", this.form).then(r => {
          ToastUtils.success(r.data.msg);
          //TODO 演示时去除注释
          // this.$router.push("/customers")
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
    },
  }
</script>

<style scoped>
</style>
