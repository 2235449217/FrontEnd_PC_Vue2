<template>
  <div class="logic-flow-view">
    <div class="save-nav">
      <div class="btn-box">
        <el-button class="btn-white" type="primary" size="small" :loading="saveLoading" @click="save">保存</el-button>
        <el-button type="primary" size="small" :loading="startLoading" @click="start">启用流程</el-button>
      </div>
    </div>
    <!-- 辅助工具栏 -->
    <!-- <Control
      v-if="lf"
      class="demo-control"
      :lf="lf"
      @catData="$_catData"
    /> -->
    <div class="content-pane">
      <div class="view-panel">
        <ToolBar v-if="lf" :lf="lf" :node-list="nodeList" @catData="$_catData" @catTurboData="$_catTurboData" />
        <!-- 画布 -->
        <div id="LF-view" />
      </div>

      <PropertiesPanel v-if="lf" :node-data="clickNode" :click-type="clickType" :lf="lf" />
    </div>

    <!-- 用户节点自定义操作面板 -->
    <!-- <AddPanel
      v-if="showAddPanel"
      class="add-panel"
      :style="addPanelStyle"
      :lf="lf"
      :node-data="addClickNode"
      @addNodeFinish="hideAddPanel"
    /> -->
    <!-- 属性面板 -->
    <!-- <el-drawer
      title="设置节点属性"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="500px"
      :before-close="closeDialog"
    >
      <PropertyDialog
        v-if="dialogVisible"
        :node-data="clickNode"
        :lf="lf"
        @setPropertiesFinish="closeDialog"
      />
    </el-drawer> -->
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%"
    >
      <DataDialog :graph-data="graphData" />
    </el-dialog>
    <!-- <h4>更多示例：
      <el-button type="text" @click="goto">BpmnElement & TurboAdpter</el-button>
    </h4> -->
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core';
import { Menu, Snapshot, BpmnElement } from '@logicflow/extension';
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import ToolBar from '@/components/workflow/LFComponents/ToolBar';
import PropertiesPanel from '@/components/workflow/PropertySetting/PropertiesPanel';
import DataDialog from '@/components/workflow/LFComponents/DataDialog';
import { nodeList } from '@/components/workflow/config';
import { toTurboData, toLogicflowData } from '@/utils/adpterForTurbo.js';
import { Message } from 'element-ui';

import {
  registerStart,
  registerEnd,
  registerApprove,
  registerEdge,
  registerSend
} from '@/components/workflow/registerNode';
const demoData = require('@/components/workflow/dataTurbo.json');

import { saveFlow, startFlow } from '@/api/app';
export default {
  name: 'LF',
  components: { DataDialog, ToolBar, PropertiesPanel },
  data () {
    return {
      startLoading: false,
      saveLoading: false,
      lf: null,
      showAddPanel: false,
      addPanelStyle: {
        top: 0,
        left: 0
      },
      nodeData: null,
      // addClickNode: null,
      clickNode: null,
      clickType: 'start',
      // dialogVisible: false,
      graphData: null,
      dataVisible: false,
      config: {
        background: {
          backgroundColor: 'rgb(255,255,255)'
          // backgroundColor: 'black'
        },
        stopScrollGraph: true,
        // stopMoveGraph: true,
        // grid: {
        //   size: 10,
        //   visible: false
        // },
        keyboard: {
          enabled: true
        },
        // style: {
        // rect: {
        //   radius: 2,
        //   rx: 2,
        //   ry: 2
        // },
        // edgeText: { // 边文本样式
        //   background: {
        //     fill: '#fff'
        //   }
        // }
        // },
        edgeTextEdit: false,
        // edgeTextDraggable: false,
        hoverOutline: false
        // 菜单前置钩子
        // guards: {
        //   beforeClone (data) {
        //     console.log('beforeClone', data);
        //     return true;
        //   },
        //   beforeDelete (data) {
        //     // 可以根据data数据判断是否允许删除，允许返回true,不允许返回false
        //     // 文档： http://logic-flow.org/guide/basic/keyboard.html#%E5%A6%82%E4%BD%95%E9%98%BB%E6%AD%A2%E5%88%A0%E9%99%A4%E6%88%96%E8%80%85%E6%8B%B7%E8%B4%9D%E8%A1%8C%E4%B8%BA
        //     console.log('beforeDelete', data);
        //     // _this.$message('不允许删除', 'error')
        //     return true;
        //   }
        // }
      },
      moveData: {},
      nodeList
    };
  },
  mounted () {
    this.$_initLf();
  },
  methods: {
    $_initLf () {
      // 使用插件
      LogicFlow.use(Menu);
      LogicFlow.use(Snapshot);
      // 使用bpmn插件，引入bpmn元素，这些元素可以在turbo中转换后使用
      LogicFlow.use(BpmnElement);
      const lf = new LogicFlow({ ...this.config, container: document.querySelector('#LF-view') });
      // 自定义菜单
      lf.extension.menu.setMenuConfig({
        nodeMenu: [
          {
            text: '删除',
            callback(node) {
              if (node.type !== 'start' && node.type !== 'end') {
                lf.deleteNode(node.id);
              } else {
                Message.error({ message: '禁止删除该节点' });
              }
            }
          },
          {
            text: '复制节点',
            callback(node) {
              if (node.type !== 'start' && node.type !== 'end') {
                lf.cloneNode(node.id);
              } else {
                Message.error({ message: '禁止复制该节点' });
              }
            }
          }
        ],
        edgeMenu: [
          {
            text: '删除',
            callback(edge) {
              lf.deleteEdge(edge.id);
            }
          }
        ],
        // 覆盖默认的节点右键菜单
        // edgeMenu: false, // 删除默认的边右键菜单
        graphMenu: [] // 覆盖默认的边右键菜单，与false表现一样
      });
      this.lf = lf;
      // 注册自定义边并设置为默认
      registerEdge(this.lf);
      lf.setDefaultEdgeType('customEdge');
      // 菜单配置文档：http://logic-flow.org/guide/extension/extension-components.html#%E8%8F%9C%E5%8D%95

      // 设置主题
      lf.setTheme({
        rect: {
          outlineColor: '#E1E3E5',
          strokeWidth: 0.5,
          fill: '#F7F9FE'
        }
      });
      this.$_registerNode();
    },
    // 自定义
    $_registerNode () {
      registerStart(this.lf);
      registerEnd(this.lf);
      registerApprove(this.lf);
      registerSend(this.lf);
      this.$_render();
    },
    $_render () {
      // Turbo数据转换为LogicFlow内部识别的数据结构
      const lFData = toLogicflowData(demoData);
      // this.$state
      this.lf.render(lFData);
      this.lf.graphModel.selectNodeById(demoData.flowElementList[0].key);
      this.clickNode = this.$data.lf.getGraphData().nodes[0];
      this.$_LfEvent();
    },
    $_getData () {
      const data = this.lf.getGraphData();
      console.log(JSON.stringify(data));
    },
    $_LfEvent () {
      this.lf.on('node:click', ({ data }) => {
        // console.log('node:click', data);
        this.$data.clickNode = data;
        this.clickType = data.type;
        // this.$data.dialogVisible = true;
      });
      this.lf.on('edge:click', ({ data }) => {
        this.$data.clickNode = this.lf.getDataById(data.id);
        console.log('edge:click', this.lf.getDataById(data.id));
        this.clickType = data.type;
        // this.$bus.$emit('init', data);
        // this.$data.dialogVisible = true;
      });
      this.lf.on('element:click', () => {
        // this.hideAddPanel();
      });
      // this.lf.on('edge:add', ({ data }) => {
      //   console.log('edge:add', data);
      // });
      // this.lf.on('node:mousemove', ({ data }) => {
      //   console.log('node:mousemove');
      //   this.moveData = data;
      // });
      this.lf.on('blank:click', () => {
        console.log('点击空白');
        // this.hideAddPanel();
      });
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg
        });
      });
      // this.lf.on('node:mousemove', () => {
      //   console.log('on mousemove');
      // });
    },
    // clickPlus (e, attributes) {
    //   e.stopPropagation();
    //   console.log('clickPlus', e, attributes);
    //   const { clientX, clientY } = e;
    //   console.log(clientX, clientY);
    //   this.$data.addPanelStyle.top = (clientY - 40) + 'px';
    //   this.$data.addPanelStyle.left = clientX + 'px';
    //   this.$data.showAddPanel = true;
    //   this.$data.addClickNode = attributes;
    // },
    // mouseDownPlus (e, attributes) {
    //   e.stopPropagation();
    //   console.log('mouseDownPlus', e, attributes);
    // },
    // hideAddPanel () {
    //   this.$data.showAddPanel = false;
    //   this.$data.addPanelStyle.top = 0;
    //   this.$data.addPanelStyle.left = 0;
    //   this.$data.addClickNode = null;
    // },
    closeDialog () {
      this.$data.dialogVisible = false;
    },
    $_catData() {
      this.$data.graphData = this.$data.lf.getGraphData();
      this.$data.dataVisible = true;
    },
    $_catTurboData() {
      const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData);
      this.$data.dataVisible = true;
    },
    // 保存表格的数据
    save() {
      this.saveLoading = true;
      const graphData = this.$data.lf.getGraphData();
      // 数据转化为Turbo识别的数据结构
      this.$data.graphData = toTurboData(graphData);
      // this.$data.dataVisible = true;
      saveFlow({
        appId: Number(this.$route.params.id),
        flow: this.$data.graphData
      }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      }).finally(() => {
        this.saveLoading = false;
      });
    },
    start() {
      this.startLoading = true;
      startFlow({
        appId: Number(this.$route.params.id),
        isEnable: 2
      }).then(() => {
        this.$message({
          message: '启用成功',
          type: 'success'
        });
      }).finally(() => {
        this.startLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/button.scss";
.logic-flow-view {
  position: absolute;
  top: 60px;
  bottom:0;
  left: 0;
  right: 0;
}
.save-nav{
  position: absolute;
  box-sizing: border-box;
  // border-top: 1px solid rgba(155,155,155,0.1);
  box-shadow: 0 3px 8px 0 rgb(0 0 0 / 15%);
  width: 100%;
  top: 0;
  height:50px;
  display: flex;
  align-items: center;
  justify-content:flex-end;
  .btn-box{
    position: relative;
    float: right;
    right: 10px;
  }
}
.content-pane{
  position: absolute;
  display:flex;
  top: 50px;
  bottom:0px;
  width:100%;
  // height: 100%;
  overflow: hidden;
}
.demo-title{
  text-align: center;
  margin: 20px;
}
.demo-control{
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
.view-panel{
  position: relative;
  bottom: 0px;
  flex-grow: 1;
  height: 100%;
  outline: none;
  #LF-view{
    // width: 100%;
    height: 100%;
    outline: none;
    /* margin-left: 50px; */
  }
}

.time-plus{
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
.btn-white{
  background-color: white;
  // border-color: rgb(230, 230, 230);
  color: #0DB3A6;
  &:hover{
    color: #fff;
    background-color:#0DB3A6;
  }
}
</style>

