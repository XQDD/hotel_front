<template>
  <b-container style="width: 90%;min-width: 50rem;display:flex; align-items: center;flex-direction: column " fluid>
    <div style="display: flex;flex-direction: column;align-self: flex-start;width: 100%">
      <div style="display: flex;margin:  1rem 0;align-items: center">
        <!--搜索-->
        <vue-bootstrap-typeahead
          style="margin-right:  0.5rem;flex: 1;max-width: 15rem"
          v-model="params.keyword"
          :minMatchingChars="1"
          placeholder="关键字"
          @hit="queryPage"
          @keyup.enter.native="queryPage"
          :data="autocompletes"/>
        <b-button @click="queryPage">搜索</b-button>
        <span style="margin-left:  2rem;margin-right: 1rem"></span>
        <b-input style="width: 15rem;margin-right: 1rem" v-model="roleName"/>
        <b-button @click="addRole">添加角色</b-button>

      </div>
      <div>
        <span>角色</span>
        <b-button
          v-long-press="300"
          @long-press-start="deleteRole(v.id)"
          style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInY"
          v-for="(v,k) in pageData" pill
          @click="toggleRole(v.id)"
          :variant="(role.id!==v.id?'outline-':'')+'warning'" :key="k">
          {{v.name}}
        </b-button>
      </div>
    </div>

    <div v-if="role.id" style="align-self: flex-start;display: flex;flex-direction: column">
      <span>权限</span>
      <span>客房模块</span>
      <div>
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated fadeIn"
                  v-for="(v,k) in roomPermissions" pill
                  @click="togglePermission(v.id)"
                  :variant="(role.permissions.findIndex(p=>p.id===v.id)<0?'outline-':'')+'primary'" :key="k">
          {{v.name}}
        </b-button>
      </div>
      <span>客房记录模块</span>
      <div>

        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated fadeIn"
                  v-for="(v,k) in roomRecordPermissions" pill
                  @click="togglePermission(v.id)"
                  :variant="(role.permissions.findIndex(p=>p.id===v.id)<0?'outline-':'')+'primary'" :key="k">
          {{v.name}}
        </b-button>
      </div>
      <span>客户模块</span>
      <div>
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated fadeIn"
                  v-for="(v,k) in customerPermissions" pill
                  @click="togglePermission(v.id)"
                  :variant="(role.permissions.findIndex(p=>p.id===v.id)<0?'outline-':'')+'primary'" :key="k">
          {{v.name}}
        </b-button>
      </div>
      <span>系统用户模块</span>
      <div>
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated fadeIn"
                  v-for="(v,k) in userPermissions" pill
                  @click="togglePermission(v.id)"
                  :variant="(role.permissions.findIndex(p=>p.id===v.id)<0?'outline-':'')+'primary'" :key="k">
          {{v.name}}
        </b-button>
      </div>
      <span>通用模块</span>
      <div>
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated fadeIn"
                  v-for="(v,k) in commonPermissions" pill
                  @click="togglePermission(v.id)"
                  :variant="(role.permissions.findIndex(p=>p.id===v.id)<0?'outline-':'')+'primary'" :key="k">
          {{v.name}}
        </b-button>
      </div>

      <b-button @click="updateRole" variant="outline-dark" style="width:8rem;margin-top: 2rem;align-self: center">
        保存设置
      </b-button>

    </div>
  </b-container>
</template>

<script>
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import LongPress from 'vue-directive-long-press'
  import {ToastUtils} from "../../../utils/utils";

  let fetchPage = (that) => that.axios
    .get("/user/getAllRole", {params: that.params})
    .then(r => {
      that.pageData = r.data.data;
      if (that.role.id && r.data.data.findIndex(r => r.id === that.role.id) < 0) {
        that.role = {}
      }
    })


  export default {
    directives: {
      'long-press': LongPress
    },
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
      //获取权限列表
      this.axios.get("/user/getAllPermission").then(response => {
        this.permissions = response.data.data;
      })
    },
    data() {
      return {
        //请求参数
        params: {
          //搜索关键字
          keyword: null,
        },
        form: null,
        //服务器返回数据
        pageData: [],
        //搜索字段提示
        autocompletes: [],
        roles: [],
        permissions: [],
        roleName: null,
        //当前选择的角色信息
        role: {}
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
      toggleRole(id) {
        if (this.role.id === id) {
          //当前角色状态id等于选择的id，取消选择
          this.role = {}
        } else {
          //当前角色改为选择的角色
          this.role = {...this.pageData[this.pageData.findIndex(r => r.id === id)]}
        }
      },
      addRole() {
        if (this.roleName) {
          this.form = {name: this.roleName};
          this.save()
        }
      },
      save() {
        this.axios.post("/user/saveRole", this.form).then((res) => {
          ToastUtils.success(res.data.msg)
          fetchPage(this)
        })
      },
      updateRole() {
        this.form = {...this.role};
        this.save();
      },
      deleteRole(roleId) {
        this.$bvModal.msgBoxConfirm("是否删除该系统角色？", {
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
            this.axios.get("/user/deleteRole", {params: {roleId}}).then(() => {
              fetchPage(this)
            })
          }
        })
      },
      togglePermission(permissionId) {
        let index = this.role.permissions.findIndex(r => r.id === permissionId);
        if (index < 0) {
          this.role.permissions.push({id: permissionId})
        } else {
          this.role.permissions.splice(index, 1)
        }
      }
    },
    computed: {
      roomPermissions() {
        return this.permissions.filter(p => p.permission.startsWith("sys:room:"))
      },
      userPermissions() {
        return this.permissions.filter(p => p.permission.startsWith("sys:user:"))
      },
      customerPermissions() {
        return this.permissions.filter(p => p.permission.startsWith("sys:customer:"))
      },
      roomRecordPermissions() {
        return this.permissions.filter(p => p.permission.startsWith("sys:roomRecord:"))
      },
      commonPermissions() {
        return this.permissions.filter(p => p.permission.startsWith("sys:common:"))
      },
    }
  }
</script>

<style scoped>
</style>
