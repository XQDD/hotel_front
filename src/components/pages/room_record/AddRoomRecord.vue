<template>
  <b-container style="margin-top: 5rem;width: 50%;min-width: 30rem" fluid>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        :label-cols-sm="3"
        label="房号">
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1"
          v-model="form.room.roomNo"
          :minMatchingChars="1"
          placeholder="请输入房号"
          ref="roomNo"
          :data="roomNos"/>
      </b-form-group>


      <b-form-group
        :label-cols-sm="3"
        label="客户姓名">
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1"
          v-model="form.customer.name"
          :minMatchingChars="1"
          placeholder="请输入客户姓名"
          ref="name"
          @hit="setUser('name',form.customer.name)"
          :data="names"/>
      </b-form-group>

      <b-form-group
        :label-cols-sm="3"
        label="性别">
        <b-form-radio-group
          style="display: flex;align-items: center;height: 100%"
          v-model="form.customer.sex">
          <b-form-radio value="男">男</b-form-radio>
          <b-form-radio value="女">女</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group
        :label-cols-sm="3"
        label="客户电话">
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1"
          v-model="form.customer.phoneNumber"
          :minMatchingChars="1"
          placeholder="请输入客户电话"
          @hit="setUser('phoneNumber',form.customer.phoneNumber)"
          ref="phoneNumber"
          :data="phoneNumbers"/>
      </b-form-group>

      <b-form-group
        :label-cols-sm="3"
        label="客户身份证">
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1"
          v-model="form.customer.identification"
          :minMatchingChars="1"
          ref="identification"
          placeholder="请输入客户身份证"
          @hit="setUser('identification',form.customer.identification)"
          :data="identifications"/>
      </b-form-group>

      <FormInput
        :field="$v.form.startTime"
        :server-error="serverErrors.startTime"
        label="入住日期"
        placeholder="请选择入住日期"
        error="入住日期不能为空"
        type="date"
        label-length="3"
        :submitting="submitting"
      />

      <FormInput
        :field="$v.form.endTime"
        :server-error="serverErrors.endTime"
        label="离店日期"
        placeholder="请选择离店日期"
        error="离店日期不能为空"
        label-length="3"
        type="date"
        :submitting="submitting"
      />

      <b-form-group
        :label-cols-sm="3"
        label="是否支付">
        <b-form-radio-group
          style="display: flex;align-items: center;height: 100%"
          v-model="form.payed">
          <b-form-radio value="false">否</b-form-radio>
          <b-form-radio value="true">是</b-form-radio>
        </b-form-radio-group>
      </b-form-group>


      <div class="d-flex flex-row justify-content-center my-1">
        <b-button :disabled="$v.form.$invalid" @click="onSubmit" variant="primary"
                  :style="{cursor:$v.form.$invalid?'not-allowed':''}">
          预订
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
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import {ToastUtils} from "../../../utils/utils";

  library.add(faPlus);
  Vue.use(VuePreviewer)


  export default {
    created() {
      //获取所有房号
      this.axios.get("/room/getRoomNos").then(r => {
        this.roomNos = r.data.data;
      })
      //数据回显
      let roomNo = this.$route.query.roomNo;
      if (roomNo) {
        this.form.room.roomNo = roomNo;
      }
      //获取所有用户信息
      this.axios.get("/customer/getAllCustomers", {params: {pageSize: 9999999}}).then(r => {
        this.customers = r.data.data.content;
      })
    },
    mounted() {
      //初始化房号
      if (this.form.room.roomNo) {
        this.$refs.roomNo.inputValue = this.form.room.roomNo
      }
      if (this.form.customer.name) {
        this.$refs.name.inputValue = this.form.customer.name
      }
    },
    components: {
      FormInput, VueBootstrapTypeahead
    },
    data() {
      return {
        //表单数据
        form: {
          room: {
            roomNo: null
          },
          customer: {
            name: null,
            phoneNumber: null,
            identification: null,
            sex: '男'
          },
          startTime: null,
          endTime: null,
          payed: false
        },
        //服务器错误
        serverErrors: {},
        //是否表单提交中
        submitting: false,
        //服务器房号列表
        roomNos: [],
        customers: []
      }
    },
    validations: {
      form: {
        customer: {
          name: {required},
          phoneNumber: {required},
          identification: {required},
        },
        startTime: {required},
        endTime: {required},
        room: {roomNo: {required}},
      }
    },
    methods: {
      onSubmit(e) {
        if (!(e instanceof MouseEvent)) return;
        //更新表单提交状态
        this.submitting = true;
        this.axios.post("/roomRecord/enter", this.form).then(r => {
          ToastUtils.success(r.data.msg);
          // this.$router.push("/roomRecords")
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
      setUser(type, value) {
        let index = this.customers.findIndex(a => a[type] === value);
        if (index >= 0) {
          this.form.customer = {...this.customers[index]}
          this.$refs.name.inputValue = this.form.customer.name
          this.$refs.identification.inputValue = this.form.customer.identification
          this.$refs.phoneNumber.inputValue = this.form.customer.phoneNumber
        }
      }
    },
    computed: {
      names() {
        return [...new Set(this.customers.map(u => u.name))]
      },
      identifications() {
        return [...new Set(this.customers.map(u => u.identification))]
      },
      phoneNumbers() {
        return [...new Set(this.customers.map(u => u.phoneNumber))]
      },
    },
  }
</script>

<style scoped>
</style>
