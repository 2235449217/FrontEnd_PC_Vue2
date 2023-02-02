<template>
  <div class="container">
    <!-- 左侧 -->
    <div class="left-board">
      <!-- 左上角标题，图标 -->
      <div class="logo-wrapper">
        <div class="logo">
          <img
            :src="logo"
            alt="logo"
          > Form Generator
          <a
            class="github"
            href="https://github.com/JakHuang/form-generator"
            target="_blank"
          >
            <img
              src="https://github.githubassets.com/pinned-octocat.svg"
              alt
            >
          </a>
        </div>
      </div>
      <!-- 左侧按钮 -->
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div
            v-for="(item, listIndex) in leftComponents"
            :key="listIndex"
          >
            <!-- 左侧图标，标题 -->
            <div class="components-title">
              <!-- <svg-icon icon-class="component" /> -->
              {{ item.title }}
            </div>
            <!-- 左侧按钮组 -->
            <!-- draggable：导入vuedraggable插件，详见：https://www.itxst.com/vue-draggable/tutorial.html -->
            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <!-- <div>123452</div> -->
                <!-- 真正拖拽的不是下面这个盒子，下面这个盒子只负责显示，上面的遏制 -->
                <div class="components-body">
                  <svg-icon :icon-class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 中间 -->
    <div class="center-board">
      <!-- 中间：运行，查看json等按钮 -->
      <div class="action-bar">
        <el-button
          icon="el-icon-check"
          type="text"
          @click="preservation"
        >
          保存
        </el-button>
        <!-- <el-button
          icon="el-icon-view"
          type="text"
          @click="preview"
        >
          预览
        </el-button> -->
        <el-button
          icon="el-icon-video-play"
          type="text"
          @click="handelConfirm"
        >
          预览
        </el-button>
        <!-- <el-button
          icon="el-icon-view"
          type="text"
          @click="showJson"
        >
          查看json
        </el-button>
        <el-button
          icon="el-icon-download"
          type="text"
          @click="download"
        >
          导出vue文件
        </el-button>
        <el-button
          class="copy-btn-main"
          icon="el-icon-document-copy"
          type="text"
          @click="copy"
        >
          复制代码
        </el-button> -->
        <el-button
          class="delete-btn"
          icon="el-icon-delete"
          type="text"
          @click="empty"
        >
          清空
        </el-button>
      </div>
      <!-- 中间拖拽组件的地方 -->
      <el-scrollbar class="center-scrollbar">
        <!--formConf是config.js中右面板的表单属性-->
        <el-row
          class="center-board-row"
          :gutter="formConf.gutter"
        >
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
            >
              <!-- {{ drawingList }} -->
              <!--drawingList里面的是拖入中间的表单的json格式数据 （可以看一下drawingList） -->
              <draggable-item
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :drawing-list="drawingList"
                :current-item="item"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeItem="activeFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
              <!-- {{ drawingList }} -->
            </draggable>
            <!-- <br>
            <span style="color:blue">drawingList:</span>{{ drawingList }}
            <br>
            <span style="color:blue">activeId:</span>{{ activeId }}
            <br>
            <span style="color:blue">formConf:</span>{{ formConf }} -->
            <div
              v-show="!drawingList.length"
              class="empty-info"
            >
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <!-- 右边 -->
    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
      @fetch-data="fetchData"
    />
    <!-- 点击“运行-》确定”时的组件 -->
    <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <!-- 【查看json】页面 -->
    <!-- :json-str="JSON.stringify(formData)"：向外传递formData  @refresh="refreshJson"：接收refreshJson(data)函数  -->
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
    <!-- 点击“运行”时的组件 -->
    <!-- showFileName是【导出Vue文件】那块的 -->
    <!-- generate(data) : data:表单数据对象formData: {
        fileName: undefined,
        type: 'file'
      }, -->
    <!-- <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    /> -->
    <input
      id="copyNode"
      type="hidden"
    >
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
// import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
// import render from '@/components/formgenerator/render/render';
import FormDrawer from '@/components/formgenerator/FormDrawer';
import JsonDrawer from '@/components/formgenerator/JsonDrawer';
import RightPanel from '@/components/formgenerator/RightPanel';
import {
  inputComponents, selectComponents, layoutComponents, formConf
} from '@/components/formgenerator/generator/config';
import {
  beautifierConf, deepClone, isObjectObject
} from '@/utils/index';
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/formgenerator/generator/html';
import { makeUpJs } from '@/components/formgenerator/generator/js';
import { makeUpCss } from '@/components/formgenerator/generator/css';
import drawingDefalut from '@/components/formgenerator/generator/drawingDefalut';
import logo from '@/assets/logo.png';
// import CodeTypeDialog from '@/components/formgenerator/CodeTypeDialog';
import DraggableItem from '@/components/formgenerator/DraggableItem';
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db';
import loadBeautifier from '@/utils/loadBeautifier';
import { formExit, getDepartmentsAndUsers } from '@/api/formGenerator';

let beautifier;
// const emptyActiveData = { style: {}, autosize: {}};
let oldActiveId;
let tempActiveData;
const drawingListInDB = getDrawingList();
const formConfInDB = getFormConf();
const idGlobal = getIdGlobal();

export default {
  components: {
    draggable,
    // render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    DraggableItem
  },
  data() {
    return {
      logo,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingDefalut[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      leftComponents: [
        {
          title: '基础字段',
          list: inputComponents
        },
        {
          title: '增强字段',
          list: selectComponents
        },
        {
          title: '部门成员字段',
          list: layoutComponents
        }
      ],
      appId: '',
      form: ''
    };
  },
  computed: {
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function(val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val);
        if (val.length === 0) this.idGlobal = 100;
      },
      deep: true
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true
    }
  },
  mounted() {
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB;
    } else {
      this.drawingList = drawingDefalut;
    }
    this.activeFormItem(this.drawingList[0]);
    if (formConfInDB) {
      this.formConf = formConfInDB;
    }
    loadBeautifier(btf => {
      beautifier = btf;
    });
    const clipboard = new ClipboardJS('#copyNode', {
      text: trigger => {
        const codeStr = this.generateCode();
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        });
        return codeStr;
      }
    });
    clipboard.on('error', e => {
      this.$message.error('代码复制失败');
    });
  },
  methods: {
    handelConfirm() {
      // this.$refs.elForm:获取ref = "elForm"这个表单的引用（就是拿到了这个表单）
      // validate:表单验证。
      // this.$refs.elForm.validate(valid => {
      //   if (!valid) return;
      // formDate是【导出vue文件】的文件名'file''dialog'
      this.generateConf = { type: 'file' };
      this.AssembleFormData();
      this.drawerVisible = true;
      // 点击关闭后，关闭当前弹窗
      // this.close();
      // });
    },
    setObjectValueReduce(obj, strKeys, data) {
      const arr = strKeys.split('.');
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = data;
        } else if (!isObjectObject(pre[item])) {
          pre[item] = {};
        }
        return pre[item];
      }, obj);
    },
    // 这儿可以改options
    setRespData(component, resp) {
      const { dataPath, renderKey, dataConsumer } = component.__config__;
      if (!dataPath || !dataConsumer) return;
      const respData = dataPath.split('.').reduce((pre, item) => pre[item], resp);

      // 将请求回来的数据，赋值到指定属性。
      // 以el-tabel为例，根据Element文档，应该将数据赋值给el-tabel的data属性，所以dataConsumer的值应为'data';
      // 此时赋值代码可写成 component[dataConsumer] = respData；
      // 但为支持更深层级的赋值（如：dataConsumer的值为'options.data'）,使用setObjectValueReduce
      this.setObjectValueReduce(component, dataConsumer, respData);
      const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey);
      if (i > -1) this.$set(this.drawingList, i, component);
    },
    // 在拖入表单之前，修改config.js里面的配置。比如修改options。[获取部门及成员]
    fetchData(component) {
      getDepartmentsAndUsers()
        .then((res) => {
          console.log(res, '我是部门列表');
          // defaultValue里面的值是value，级联选择器显示的值是label
          // component.options.id = res.data.list.dept.dept_id + 100;
          // component.options.value = res.data.list.dept;
        })
        .catch((error) => {
          console.log(error, '我是部门列表错误');
        });
      component.options = [{
        // id: 1,
        value: 1.1,
        label: '选项1',
        children: [{
          // id: 2,
          value: 2.2,
          label: '选项1-1'
        }]
      }];
      const { dataType, method, url } = component.__config__;
      // console.log(component, '1233333333333');
      if (dataType === 'dynamic' && method && url) {
        this.setLoading(component, true);
        this.$axios({
          method,
          url
        }).then(resp => {
          this.setLoading(component, false);
          this.setRespData(component, resp.data);
        });
      }
    },
    setLoading(component, val) {
      const { directives } = component;
      if (Array.isArray(directives)) {
        const t = directives.find(d => d.name === 'loading');
        if (t) t.value = val;
      }
    },
    activeFormItem(currentItem) {
      this.activeData = currentItem;
      this.activeId = currentItem.__config__.formId;
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.fetchData(tempActiveData);
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.fetchData(clone);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      const config = clone.__config__;
      config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
      return tempActiveData;
    },
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`;
        !Array.isArray(config.children) && (config.children = []);
        delete config.label; // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem));
      }
      return item;
    },
    AssembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      };
      // console.log(JSON.stringify(this.formConf), '我可能就是你想要的formConf');
      // console.log(JSON.stringify(this.drawingList), '我可能就是你想要的drawingList');
    },
    // console.log(this.formData, '我可能就是你想要的表单数据');
    // generate(data) {
    // data = { undefined, type: 'file' };
    // titleCase(this.operationType):titleCase(run) :返回值Run
    // const func = this[`exec${'Run'}`];
    // console.log(func, '我是func');
    // 你是fileName和type，是【导出vue文件】那块的
    // console.log(this.generateConf, 'generateConf猜猜我是什么');
    // func && func(data);
    // },
    // execRun(data) {
    //   // console.log('不信吧，我真的执行了');
    //   this.AssembleFormData();
    //   this.drawerVisible = true;
    // },
    // execDownload(data) {
    //   const codeStr = this.generateCode();
    //   const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
    //   saveAs(blob, data.fileName);
    // },
    // execCopy(data) {
    //   document.getElementById('copyNode').click();
    // },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = [];
          this.idGlobal = 100;
        }
      );
    },
    drawingItemCopy(item, list) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      list.push(clone);
      this.activeFormItem(clone);
    },
    drawingItemDelete(index, list) {
      list.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
    },
    generateCode() {
      const { type } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formData, type));
      const html = vueTemplate(makeUpHtml(this.formData, type));
      const css = cssStyle(makeUpCss(this.formData));
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson() {
      this.AssembleFormData();
      // console.log(JSON.stringify(this.formData), 123456);
      this.jsonDrawerVisible = true;
    },
    // 保存功能
    preservation() {
      this.AssembleFormData();
      // 存储在Vuex中
      this.$store.commit('SET_FORM', this.formData);
      // console.log(this.$store.getters.form, 'this.$store.getters.form');
      // console.log(this.formData, '我是你要送走的数据');
      // // console.log(this.formData, '我是你要送走的数据2');
      // alert('已保存');
      // console.log('我要发送请求了');
      // console.log(Number(this.$route.params.id), 'djfkjdkfj11111');
      if (!this.formData.fields.length) return alert('不能保存空的表单');
      this.appId = Number(this.$route.params.id);
      this.form = this.formData;
      // console.log(this.formData, '12485484848');
      // 不能提交空的表单，记得加if条件
      formExit(this.appId, this.form)
        .then((res) => {
          alert(res.msg);
          // console.log(res, '保存表单的功能实现了');
        })
        .catch((error) => {
          alert(error);
          console.log(error, '保存表单的功能失败了');
        });
    },
    // 预览功能
    preview() {
      this.drawerVisible = true;
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = this.activeData.__vModel__;
      config.formId = this.activeId;
      config.span = this.activeData.__config__.span;
      this.activeData.__config__.tag = config.tag;
      this.activeData.__config__.tagIcon = config.tagIcon;
      this.activeData.__config__.document = config.document;
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue;
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId);
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },
    refreshJson(data) {
      this.drawingList = deepClone(data.fields);
      delete data.fields;
      this.formConf = data;
    }
  }
};
</script>

<style lang='scss'>
// @：就是src目录
@import '@/styles/form.scss';
</style>
