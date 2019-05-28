<!--封装的页面基本框架-->
<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2" style="display: flex;flex-direction: column">
        <b-card header-bg-variant="transparent" class="text-center">
          <b-img slot="header" height="80" style="width: 6rem" rounded="circle"
                 src="../assets/images/login_hotel3.jpg" class="card-img-top"></b-img>
          <b-dropdown size="sm" text="XQDD">
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
    faBuilding,
    faChartLine,
    faCogs,
    faHome,
    faIdCard,
    faList,
    faPeopleCarry,
    faPlusSquare,
    faSignOutAlt,
    faUser,
    faUserCog,
    faUserFriends,
    faUserPlus,
    faUsers,
    faUsersCog
  } from '@fortawesome/free-solid-svg-icons'

  library.add(faSignOutAlt, faBuilding, faHome, faList, faPlusSquare, faUser, faUserFriends, faPeopleCarry, faUsers, faUserPlus, faChartLine, faUserCog, faUsersCog, faCogs, faIdCard);


  export default {
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
            name: "客户",
            icon: "user",
            iconColor: "#d8ffe6",
            parent: true,
          },
          {
            name: "客户列表",
            icon: "user-friends",
            link: "/users",
          },
          {
            name: "添加客户",
            icon: "user-plus",
            link: "/addUser",
          },
          {
            name: "员工",
            icon: "people-carry",
            iconColor: "#f3e6df",
            parent: true,
          },
          {
            name: "员工列表",
            icon: "users",
            link: "/employee",
          },
          {
            name: "添加员工",
            icon: "id-card",
            link: "/addEmployee",
          },
          {
            name: "系统设置",
            icon: "cogs",
            parent: true,
          },
          {
            name: "管理员列表",
            icon: "users-cog",
            link: "/statistics",
          },
          {
            name: "添加管理员",
            icon: "user-cog",
            link: "/statistics",
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
