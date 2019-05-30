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
      </div>
    </div>
    <b-table
      striped hover bordered outlined
      :items="pageData.content"
      :fields="fields">
      <template slot="operation" slot-scope="row">
        <b-button size="sm" @click="edit(row.item.id)" class="mr-2">编辑</b-button>
      </template>
    </b-table>
    <b-pagination
      @change="fetchPage"
      :per-page="params.pageSize"
      :total-rows="pageData.totalElements"
      v-model="pageData.currPage"/>
  </b-container>
</template>

<script>
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

  let fetchPage = (that) => that.axios
    .get("/customer/getAllCustomers", {params: that.params})
    .then(r => {
      r.data.data.content.forEach(i => i._showDetails = true)
      that.pageData = r.data.data;
    })


  export default {
    components: {
      VueBootstrapTypeahead
    },
    created() {
      fetchPage(this)
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
        },
        //服务器返回数据
        pageData: {},
        //表格表头定义
        fields: {
          id: {
            label: "ID"
          },
          name: {
            label: "客户姓名",
          },
          sex: {
            label: "性别",
          },
          phoneNumber: {
            label: "手机号",
          },
          identification: {
            label: "身份证",
          },
          operation: {
            label: "操作"
          },
        },
        //搜索字段提示
        autocompletes: [],
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
      //跳转到编辑页面
      edit(id) {
        this.$router.push({path: "/addCustomer", query: {id}})
      }
    },
  }
</script>

<style scoped>

</style>
