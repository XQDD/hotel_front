<template>
  <b-container style="width: 90%;min-width: 50rem;display:flex; align-items: center;flex-direction: column " fluid>
    <!--标签列表-->
    <div style="display: flex;flex-direction: column;align-self: flex-start;width: 100%">
      <div>
        标签筛选
        <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInX"
                  v-for="(v,k) in tags" pill
                  @click="toggleTag(v)"
                  :variant="(params.tags.indexOf(v)<0?'outline-':'')+'info'" :key="k">
          {{v}}
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
        <span style="margin-left:  1rem;margin-right: 1rem">未被预订日期过滤</span>
        <b-form-input style="width: 12rem;margin-right: 0.3rem" type="date" @change="queryPage" v-model="startTime"/>
        —
        <b-form-input style="width: 12rem;margin-left: 0.3rem" type="date" @change="queryPage" v-model="endTime"/>
        <span style="margin-left:  0.5rem;margin-right: 0.5rem">排序</span>
        <b-form-select style="width: 7rem" v-model="sort" @change="changeSort">
          <option value="-1">无排序</option>
          <option value="0">价格升序</option>
          <option value="1">价格降序</option>
        </b-form-select>
        <span style="margin-left:  0.5rem;margin-right: 0.5rem">开启</span>
        <b-form-select style="width: 6rem" v-model="params.opened" @change="queryPage">
          <option value="true">是</option>
          <option value="false">否</option>
          <option :value="null">全部</option>
        </b-form-select>
      </div>

    </div>
    <b-table
      striped hover bordered outlined
      :items="pageData.content"
      :fields="fields">

      <template slot="operation" slot-scope="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">详情</b-button>
        <b-button size="sm" @click="edit(row.item.id)" class="mr-2">编辑</b-button>
        <b-button size="sm" @click="enter(row.item.roomNo)" class="mr-2">入住登记</b-button>

      </template>

      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="1" class="text-sm-right"><b>标签:</b></b-col>
            <b-col>
              <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInX"
                        v-for="(v,k) in row.item.roomTags" pill
                        variant="info" :key="row.item.id+''+k">
                {{v.name}}
              </b-button>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="1" class="text-sm-right"><b>图片:</b></b-col>
            <b-col>
              <vue-previewer :remove-enable="false"
                             :imgs="imgs(row)"></vue-previewer>
            </b-col>
          </b-row>
        </b-card>
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
  import {TimeUtils} from "../../../utils/utils";

  let fetchPage = (that) => that.axios
    .get("/room/getRoomList", {params: that.params})
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
      //获取所有标签
      this.axios.get("/room/getRoomTags").then(r => {
        this.tags = r.data.data.map(t => t.name);
        this.autocompletes = [...new Set(this.autocompletes.concat(this.tags))];
      })
      //获取所有房号
      this.axios.get("/room/getRoomNos").then(r => {
        this.autocompletes = [...new Set(this.autocompletes.concat(r.data.data))];
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
          //排序方式,0房价
          order: null,
          //查询标签
          tags: [],
          //排序顺序
          asc: null,
          //时间筛选
          startTime: null,
          endTime: null,
          //是否开启
          opened: true,
        },
        //服务器返回数据
        pageData: {},
        //表格表头定义
        fields: {
          id: {
            label: "ID"
          },
          roomNo: {
            label: "房号"
          },
          price: {
            label: "价格（元/天）"
          },
          description: {
            label: "说明"
          },
          opened: {
            label: "是否开启",
            formatter: (value) => {
              return value ? "是" : "否";
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
        sort: -1,
      }
    },
    methods: {
      //编辑客房
      edit(id) {
        this.$router.push({path: "/addRoom", query: {id}})
      },
      fetchPage(page) {
        this.params.currPage = page;
        fetchPage(this)
      },
      queryPage() {
        this.params.currPage = 1;
        fetchPage(this)
      },
      //选择标签
      toggleTag(tag) {
        let index = this.params.tags.indexOf(tag);
        if (index < 0) {
          this.params.tags.push(tag)
        } else {
          this.params.tags.splice(index, 1)
        }
        fetchPage(this)
      },
      //改变排序方式
      changeSort() {
        if (this.sort == -1) {
          this.params.asc = null;
          this.params.order = null;
        } else if (this.sort == 0) {
          this.params.asc = true;
          this.params.order = 0;
        } else if (this.sort == 1) {
          this.params.asc = false;
          this.params.order = 0;
        }
        this.queryPage()
      },
      //登记入住
      enter(roomNo) {
        this.$router.push({path: "/addRoomRecord", query: {roomNo}})
      }
    },
    computed: {
      imgs() {
        let that = this;
        return function (row) {
          return row.item.images.map(function (img) {
            return {src: that.$store.getters.url.baseUploadURL + img}
          });
        }
      },
      startTime: {
        get() {
          if (this.params.startTime == null) {
            return null;
          } else {
            return TimeUtils.formatDate(this.params.startTime);
          }
        },
        set(val) {
          if (val) {
            this.params.startTime = new Date(val + " 0:0:0").getTime()
          } else {
            this.params.startTime = null
          }
        }
      },
      endTime: {
        get() {
          if (this.params.endTime == null) {
            return null;
          } else {
            return TimeUtils.formatDate(this.params.endTime);
          }
        },
        set(val) {
          if (val) {
            this.params.endTime = new Date(val + " 0:0:0").getTime()
          } else {
            this.params.endTime = null
          }
        }
      }

    }
  }
</script>

<style scoped>

</style>
