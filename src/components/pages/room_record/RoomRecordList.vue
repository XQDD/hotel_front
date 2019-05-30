<template>
  <b-container style="width: 90%;min-width: 50rem;display:flex; align-items: center;flex-direction: column " fluid>
    <div style="display: flex;flex-direction: column;align-self: flex-start;width: 100%">
      <div style="display: flex;margin:  1rem 0;align-items: center">
        <!--搜索-->
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1;max-width: 10rem"
          v-model="params.keyword"
          :minMatchingChars="1"
          placeholder="关键字"
          @hit="queryPage"
          @keyup.enter.native="queryPage"
          :data="autocompletes"/>
        <b-button @click="queryPage">搜索</b-button>
        <span style="margin-left:  2rem;margin-right: 1rem">预订日期过滤</span>
        <b-form-input style="width: 12rem;margin-right: 0.3rem" type="date" @change="queryPage"
                      v-model="params.startTime"/>
        —
        <b-form-input style="width: 12rem;margin-left: 0.3rem" type="date" @change="queryPage"
                      v-model="params.endTime"/>
        <span style="margin-left:  2rem;margin-right: 1rem">状态过滤</span>
        <b-form-select style="width: 10rem" v-model="params.status" @change="queryPage">
          <option :value="null">全部状态</option>
          <option value="0">预订</option>
          <option value="1">入住中</option>
          <option value="2">完成</option>
          <option value="3">退房</option>
        </b-form-select>
      </div>

    </div>
    <b-table
      striped hover bordered outlined
      :items="pageData.content"
      :fields="fields">
      <template slot="roomNo" slot-scope="row">
        <b-link :to="'/addRoom?id='+row.item.room.id">{{row.item.room.roomNo}}</b-link>
      </template>
      <template slot="name" slot-scope="row">
        <b-link :to="'/addCustomer?id='+row.item.room.id">{{row.item.customer.name}}</b-link>
      </template>
      <template slot="operation" slot-scope="row">
        <b-button size="sm" @click="setStatus(row.item)" class="mr-2">更改状态</b-button>
      </template>
    </b-table>
    <b-pagination
      @change="fetchPage"
      :per-page="params.pageSize"
      :total-rows="pageData.totalElements"
      v-model="pageData.currPage"/>

    <b-modal
      ok-title="设置"
      @ok="requestSetStatus"
      cancel-title="取消"
      ref="setStatus"
      title="设置状态">
      <b-form-group
        :label-cols-sm="3"
        label="状态">
        <b-form-select style="width: 10rem" v-model="item.status">
          <option value="0">预订</option>
          <option value="1">入住中</option>
          <option value="2">完成</option>
          <option value="3">退房</option>
        </b-form-select>
      </b-form-group>

      <b-form-group
        :label-cols-sm="3"
        label="是否支付">
        <b-form-radio-group
          style="display: flex;align-items: center;height: 100%"
          v-model="item.payed">
          <b-form-radio value="false">否</b-form-radio>
          <b-form-radio value="true">是</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </b-modal>
  </b-container>
</template>

<script>
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import {TimeUtils, ToastUtils} from "../../../utils/utils";

  let fetchPage = (that) => that.axios
    .get("/roomRecord/getRecordList", {params: that.params})
    .then(r => {
      r.data.data.content.forEach(i => i._showDetails = true)
      that.pageData = r.data.data;
    })


  let getStatusText = value => {
    switch (value) {
      case 0:
        return "预订";
      case 1:
        return "入住中";
      case 2:
        return "完成";
      case 3:
        return "退房";
    }
  }

  export default {
    components: {
      VueBootstrapTypeahead
    },
    created() {
      fetchPage(this)
      //获取所有房号
      this.axios.get("/room/getRoomNos").then(r => {
        this.autocompletes = [...new Set(this.autocompletes.concat(r.data.data))];
      })
      //获取用户信息
      this.axios.get("/customer/getAllCustomers", {params: {pageSize: 99999}}).then(r => {
        let users = r.data.data.content;
        this.autocompletes = [...new Set(this.autocompletes.concat(users.map(u => u.name), users.map(u => u.identification), users.map(u => u.phoneNumber)))]
      })
    },
    data() {
      return {
        //请求参数
        params: {
          //每页显示个数
          pageSize: 8,
          //搜索关键字
          keyword: null,
          startTime: null,
          endTime: null,
          status: null,
        },
        //服务器返回数据
        pageData: {},
        //表格表头定义
        fields: {
          id: {
            label: "ID"
          },
          roomNo: {
            label: "房号",
            formatter: (value, key, item) => {
              return item.room.roomNo;
            }
          },
          name: {
            label: "客户姓名",
            formatter: (value, key, item) => {
              return item.customer.name;
            }

          },
          sex: {
            label: "性别",
            formatter: (value, key, item) => {
              return item.customer.sex;
            }
          },
          phoneNumber: {
            label: "手机号",
            formatter: (value, key, item) => {
              return item.customer.phoneNumber;
            }
          },
          identification: {
            label: "身份证",
            formatter: (value, key, item) => {
              return item.customer.identification;
            }
          },
          price: {
            label: "价格（元）"
          },
          date: {
            label: "预订日期",
            formatter: (value) => {
              return TimeUtils.formatDate(value);
            }
          },
          payed: {
            label: "是否支付",
            formatter: (value) => {
              return value ? "是" : "否";
            }
          },
          status: {
            label: "状态",
            formatter: (value) => {
              return getStatusText(value);
            }
          },
          operation: {
            label: "操作"
          },
        },
        //搜索字段提示
        autocompletes: [],
        //标签列表
        tags: [],
        //状态
        item: {},
      }
    },
    methods: {
      fetchPage(page) {
        this.params.currPage = page;
        fetchPage(this)
      },
      queryPage() {
        this.params.currPage = 1;
        fetchPage(this)
      },
      //设置状态按钮被按，显示设置状态对话框
      setStatus(record) {
        this.item = {...record}
        this.$refs['setStatus'].show()
      },
      //设置状态表单提交
      requestSetStatus(bvEvt) {
        if (bvEvt.trigger === 'ok') {
          bvEvt.preventDefault();
          this.axios.get("/roomRecord/setRecordStatus", {
            params: {
              recordId: this.item.id,
              payed: this.item.payed,
              status: this.item.status
            }
          }).then((res) => {
            ToastUtils.success(res.data.msg)
            this.$refs['setStatus'].hide()
            fetchPage(this)
          })
        }
      }

    },
    computed: {}
  }
</script>

<style scoped>

</style>
