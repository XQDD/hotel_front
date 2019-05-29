<!--通用输入框组件-->
<template>
  <b-form-group
    :label-cols-sm="labelLength"
  :label="label"
  >
  <b-form-input
    :state="(field.$dirty? (field.$error?false:null): (serverError?false:null))"
    :placeholder="placeholder"
    v-model="field.$model"
    :type="type"
    :class="!submitting&&((field.$dirty&&field.$error)||(!field.$dirty&&serverError))?'animated shake':''"
  ></b-form-input>
  <b-form-invalid-feedback>
    {{serverError&&!field.$dirty?serverError:error}}
  </b-form-invalid-feedback>
  </b-form-group>
</template>
<script>
  export default {
    props: {
      //输入框类型
      type: String,
      //输入内容提示
      placeholder: String,
      //是否表单提交中，用于重置动画
      submitting: Boolean,
      //校验错误信息
      error: String,
      //字段校验信息
      field: {
        type: Object,
        require: true,
      },
      //字段名称
      label: String,
      //字段名长度
      labelLength: {
        type: String,
        default: "2"
      },
      //服务器校验错误信息
      serverError: String,
    }
  }
</script>
