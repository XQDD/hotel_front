<!--封装的页面基本框架-->
<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2" style="display: flex;flex-direction: column">
        <b-card header-bg-variant="transparent" class="text-center">
          <b-img slot="header" height="80" style="width: 5rem" rounded="circle"
                 :src="$store.getters.url.baseUploadURL+$store.state.user.icon" class="card-img-top"></b-img>
          <b-dropdown size="sm" :text="$store.state.user.name">
            <b-dropdown-item-button @click="logout">
              <font-awesome-icon color="red" icon="sign-out-alt"/>
              退出登录
            </b-dropdown-item-button>
          </b-dropdown>
        </b-card>
        <b-list-group style="overflow-y: auto;height: 80vh">
          <b-list-group-item
            v-for="(item,index) in sideBarItems"
            :key="index"
            :active="index===activeKey"
            button
            @click="nav(index,item.link)"
            :class="'side-bar side-bar-'+(item.parent?'parent':'child')+' side-bar-'+(item.link?'can':'not')+'-click'">
            <font-awesome-icon :color="index===activeKey?'':item.iconColor" v-if="item.icon" :icon="item.icon"/>
            <span>{{item.name}}</span>
          </b-list-group-item>

        </b-list-group>
      </b-col>
      <b-col>
        <div style="margin-top: 2rem">
          <router-view></router-view>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {
    faBars,
    faBuilding,
    faChartLine,
    faCogs,
    faFile,
    faHome,
    faIdCard,
    faList,
    faPeopleCarry,
    faPlusSquare,
    faSignInAlt,
    faSignOutAlt,
    faUser,
    faUserCog,
    faUserFriends,
    faUserPlus,
    faUsers,
    faUsersCog,
    faUserTag,
  } from '@fortawesome/free-solid-svg-icons'

  library.add(faBars,faUserTag, faFile, faSignInAlt, faSignOutAlt, faBuilding, faHome, faList, faPlusSquare, faUser, faUserFriends, faPeopleCarry, faUsers, faUserPlus, faChartLine, faUserCog, faUsersCog, faCogs, faIdCard);


  export default {
    beforeRouteUpdate(to, from, next) {
      this.activeKey = this.sideBarItems.findIndex(i => i.link === to.path)
      next();
    },
    data() {
      return {
        activeKey: 0,
        sideBarItems: [
          {
            name: "首页",
            link: "/",
            icon: "home",
            parent: true,
          },
          {
            name: "客房",
            icon: "building",
            iconColor: "#e2e2e2",
            parent: true,
          },
          {
            name: "客房列表",
            icon: "list",
            link: "/rooms",
          },
          {
            name: "添加客房",
            icon: "plus-square",
            link: "/addRoom",
          },
          {
            name: "入住记录",
            icon: "file",
            iconColor: "#4f90e2",
            parent: true,
          },
          {
            name: "入住列表",
            icon: "bars",
            link: "/roomRecords",
          },
          {
            name: "入住登记",
            icon: "sign-in-alt",
            link: "/addRoomRecord",
          },
          {
            name: "客户",
            icon: "user",
            iconColor: "#d8ffe6",
            parent: true,
          },
          {
            name: "客户列表",
            icon: "user-friends",
            link: "/customers",
          },
          {
            name: "添加客户",
            icon: "user-plus",
            link: "/addCustomer",
          },
          {
            name: "系统设置",
            icon: "cogs",
            parent: true,
          },
          {
            name: "管理员列表",
            icon: "users-cog",
            link: "/sysUsers",
          },
          {
            name: "添加管理员",
            icon: "user-cog",
            link: "/addSysUser",
          },
          {
            name: "角色权限管理",
            icon: "user-tag",
            link: "/roles",
          },

        ]
      }
    },
    methods: {
      logout() {
        this.$store.commit("logout")
        this.$router.push("/login")
      },
      nav(key, link) {
        this.activeKey = key
        this.$router.push(link)
      }
    }
  }
</script>
<style>
  .card-body {
    padding: 0.3rem;
  }

  .card-header {
    padding: 0.3rem 0.6rem;
  }

  .dropdown-menu {
    padding: 0;
  }

  .side-bar {
    padding: 0.5rem 0;
  }

  .side-bar > svg {
    margin-right: 1rem;
  }

  .side-bar-parent {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .side-bar-child {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .side-bar-not-click {
    pointer-events: none;
    font-weight: bold;
    color: slategrey;
  }

  .side-bar-can-click {
  }
</style>
