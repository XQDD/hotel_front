<template>
  <b-container style="width: 90%;min-width: 50rem;display:flex; align-items: center;flex-direction: column " fluid>
    <div style="display: flex;flex-direction: column;align-self: flex-start;width: 100%">
      <div>
        角色筛选
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInY"
                  v-for="(v,k) in roles" pill
                  @click="toggleRole(v.id)"
                  :variant="(params.roles.indexOf(v.id)<0?'outline-':'')+'warning'" :key="k">
          {{v.name}}
        </b-button>
      </div>
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
      <template slot="icon" slot-scope="row">
        <vue-previewer v-if="row.value" :remove-enable="false"
                       :imgs="[{src:$store.getters.url.baseUploadURL+row.value}]"></vue-previewer>
        <span v-if="!row.value">无</span>
      </template>
      <template slot="roles" slot-scope="row">
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInY"
                  v-for="(v,k) in row.value" pill
                  variant="warning" :key="v.id+''+k">
          {{v.name}}
        </b-button>
      </template>
      <template slot="operation" slot-scope="row">
        <b-button size="sm" @click="edit(row.item.id)" class="mr-2">编辑</b-button>
        <b-button size="sm" @click="deleteSysUser(row.item.id)" class="mr-2">删除</b-button>
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
  import {ToastUtils} from "../../../utils/utils";

  let fetchPage = (that) => that.axios
    .get("/user/list", {params: that.params})
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
      //获取角色列表
      this.axios.get("/user/getAllRole").then(response => {
        this.roles = response.data.data;
        this.autocompletes = [...new Set(this.autocompletes.concat(response.data.data.map(r => r.name)))]
      })
      //获取管理员列表
      this.axios.get("/user/list", {params: {pageSize: 9999}}).then(response => {
        this.autocompletes = [...new Set(this.autocompletes.concat(response.data.data.content.map(r => r.name)))]
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
          roles: []
        },
        //服务器返回数据
        pageData: {},
        //表格表头定义
        fields: {
          id: {
            label: "ID"
          },
          name: {
            label: "账号名称",
          },
          icon: {
            label: "头像",
          },
          roles: {
            label: "角色",
          },
          operation: {
            label: "操作"
          },
        },
        //搜索字段提示
        autocompletes: [],
        roles: []
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
        this.$router.push({path: "/addSysUser", query: {id}})
      },
      toggleRole(id) {
        let index = this.params.roles.indexOf(id);
        if (index < 0) {
          this.params.roles.push(id)
        } else {
          this.params.roles.splice(index, 1)
        }
        fetchPage(this)
      },
      deleteSysUser(id) {
        this.$bvModal.msgBoxConfirm("是否删除该系统管理员？", {
          title: '确认操作',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '确认删除',
          cancelTitle: '取消',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        }).then(value => {
          if (value) {
            this.axios.get("/user/delete", {params: {sysUserId: id}}).then((res) => {
              ToastUtils.success(res.data.data)
              fetchPage(this)
            })
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
