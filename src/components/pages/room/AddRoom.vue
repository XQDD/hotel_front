<template>
  <b-container style="margin-top: 5rem;width: 50%;min-width: 30rem" fluid>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        v-if="form.id"
        label-cols-sm="3"
        label="ID">
        <div style="display: flex;align-items: center;height: 100%;">
           <span>
          {{form.id}}
        </span>
        </div>
      </b-form-group>
      <FormInput
        :field="$v.form.roomNo"
        :server-error="serverErrors.roomNo"
        label="房号"
        placeholder="请输入房号"
        error="房号不能为空"
        label-length="3"
        :submitting="submitting"
      />
      <FormInput
        :field="$v.form.price"
        :server-error="serverErrors.price"
        label="房价（元/天）"
        placeholder="请输入房价"
        error="房价格式有误，且房价必须大于等于0"
        type="number"
        label-length="3"
        :submitting="submitting"
      />
      <b-form-group
        label-cols-sm="3"
        label="标签">
        <div style="display: flex; flex-direction: row;align-items: center;">
          <!--标签自动提示-->
          <vue-bootstrap-typeahead
            style="margin-right:  0.5rem;flex: 1"
            v-model="tag"
            :minMatchingChars="1"
            :data="tags"/>
          <b-button @click="addTag">
            <font-awesome-icon icon="plus"/>
            添加
          </b-button>
        </div>
        <div style="display: flex; flex-direction: row;align-items: center;flex-wrap: wrap;">
          <b-button style="margin-top: 0.18rem;margin-right:  0.1rem;" class="animated flipInX"
                    @click="removeTag(v.name)" v-for="(v,k) in form.roomTags" pill
                    variant="info" :key="k">
            {{v.name}}
          </b-button>
        </div>
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="说明">
        <b-textarea
          v-model="form.description"
        ></b-textarea>
      </b-form-group>
      <b-form-group
        :label-cols-sm="3"
        label="是否开启客房">
        <b-form-radio-group
          style="display: flex;align-items: center;height: 100%"
          v-model="form.opened">
          <b-form-radio value="true">是</b-form-radio>
          <b-form-radio value="false">否</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="图片">
        <b-form-file @change="uploadImage" multiple capture accept="image/*" v-model="img" browse-text="上传图片"
                     placeholder="未选择图片">
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="dark">{{ img[0].name }}</b-badge>
            <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
              + {{ img.length - 1 }} 张图片
            </b-badge>
          </template>
        </b-form-file>
        <vue-previewer @onRemove="removeImage" :imgs="imgs"></vue-previewer>
      </b-form-group>


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
  import {decimal, minValue, required} from 'vuelidate/lib/validators'
  import VuePreviewer from 'vue-preview-deleter'
  import Vue from "vue";
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {faPlus} from '@fortawesome/free-solid-svg-icons'
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import {ToastUtils} from "../../../utils/utils";

  library.add(faPlus);
  Vue.use(VuePreviewer)


  export default {
    beforeRouteUpdate(to, from) {
      if (Object.keys(to.query).length === 0 && Object.keys(from.query).length > 0) {
        this.form = {
          description: null,
          id: null,
          images: [],
          price: null,
          roomNo: null,
          roomTags: this.form.roomTags,
        }
      }
    },
    created() {
      //获取所有标签
      this.axios.get("/room/getRoomTags").then(r => {
        this.tags = r.data.data.map(t => t.name);
      })
      //数据回显
      let id = this.$route.query.id;
      if (id) {
        this.form.id = id;
        this.axios.get("/room/detail", {params: {id}}).then(response => {
          this.form = response.data.data
        })
      }
    },
    components: {
      FormInput, VueBootstrapTypeahead
    },
    data() {
      return {
        //表单数据
        form: {
          description: null,
          id: null,
          images: [],
          price: null,
          roomNo: null,
          roomTags: [],
          opened: true,
        },
        //服务器错误
        serverErrors: {},
        //是否表单提交中
        submitting: false,
        //当前输入的标签
        tag: null,
        //服务器标签列表
        tags: [],
        //当前选择的图片
        img: null
      }
    },
    validations: {
      form: {
        roomNo: {required},
        price: {decimal, required, minValue: minValue(0)},
      }
    },
    methods: {
      onSubmit(e) {
        if (!(e instanceof MouseEvent)) return;
        //更新表单提交状态
        this.submitting = true;
        this.axios.post("/room/save", this.form).then(r => {
          ToastUtils.success(r.data.msg);
          //TODO 演示时去除注释
          // this.$router.push("/rooms")
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
      //添加标签
      addTag() {
        if (this.tag && this.form.roomTags.findIndex(t => t.name === this.tag) < 0) {
          this.form.roomTags.push({name: this.tag})
        }
      },
      //删除标签
      removeTag(tag) {
        this.form.roomTags = this.form.roomTags.filter(t => t.name !== tag)
      },
      //上传图片
      uploadImage() {
        Vue.nextTick().then(() => {
          if (this.img) {
            let formData = new FormData();
            this.img.forEach(img => formData.append("files", img))
            this.axios.post("/common/upload", formData).then(r => {
              this.form.images.push(...r.data.data)
            })
          }
        })
      },
      //移除图片
      removeImage(_, list) {
        this.form.images = list.map(img => img.url);
      }
    },
    computed: {
      imgs() {
        return this.form.images.map(url => {
          return {src: this.$store.getters.url.baseUploadURL + url, url};
        })
      }
    },
  }
</script>

<style scoped>
</style>
