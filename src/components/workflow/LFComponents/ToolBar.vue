<template>
  <div class="tool-bar">
    <div class="item-box">
      <el-button class="menu-item" type="text" :disabled="undoDisable" @click="$_undo">
        <span class="undo iconfont icon-wf-undo" />
      </el-button>
      <el-button class="menu-item" type="text" :disabled="redoDisable" @click="$_redo">
        <span class="redo iconfont icon-wf-redo" />
      </el-button>
      <div class="menu-line" />
      <div
        v-for="item in nodeList"
        :key="item.text"
        class="node-item"
        @mousedown="$_dragNode(item)"
      >
        <div class="node-item-icon" :class="item.class">
          <div v-if="item.type === 'user' || item.type === 'time'" class="shape" />
        </div>
        <span class="node-label">{{ item.text }}</span>
      </div>
      <div class="menu-line" />
      <div class="node-item" @click="$_catData">
        <span>查看数据</span>
      </div>
      <div class="node-item" @click="$_catTurboData">
        <span>查看turbo数据</span>
      </div>
      <div class="node-item" @click="$_zoomIn">
        <span class="zoom-in" />
        <span>放大</span>
      </div>
      <div class="node-item" @click="$_zoomOut">
        <span class="zoom-out" />
        <span>缩小</span>
      </div>
      <div class="node-item" @click="$_zoomReset">
        <span class="size" />
        <span>大小适应</span>
      </div>
      <div class="node-item" @click="$_translateRest">
        <span class="position" />
        <span>定位还原</span>
      </div>
      <!-- <div class="node-item" @click="$_reset">
        <span>还原(大小&定位)</span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lf: {
      type: Object,
      default: () => {
        return {};
      }
    },
    nodeList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data () {
    return {
      undoDisable: true,
      redoDisable: true,
      graphData: null,
      dataVisible: false
    };
  },
  mounted () {
    this.$props.lf.on('history:change', ({ data: { undoAble, redoAble }}) => {
      this.$data.undoDisable = !undoAble;
      this.$data.redoDisable = !redoAble;
    });
  },
  methods: {
    $_dragNode (item) {
      this.$props.lf.dnd.startDrag({
        type: item.type
      });
    },
    $_zoomIn() {
      this.$props.lf.zoom(true);
    },
    $_zoomOut() {
      this.$props.lf.zoom(false);
    },
    $_zoomReset() {
      this.$props.lf.resetZoom();
    },
    $_translateRest() {
      this.$props.lf.resetTranslate();
    },
    // $_reset() {
    //   this.$props.lf.resetZoom();
    //   this.$props.lf.resetTranslate();
    // },
    $_undo() {
      this.$props.lf.undo();
    },
    $_redo() {
      this.$props.lf.redo();
    },
    $_catData() {
      this.$emit('catData');
    },
    $_catTurboData() {
      this.$emit('catTurboData');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/button.scss';
.tool-bar {
  position: relative;
  top: 10px;
  // left: 20px;
  // right: 20px;
  padding: 0 20px;
  z-index:101;
  .item-box{
    display: flex;
    padding:5px;
    background: #F4F6FC;
    border-radius: 2px;
    box-sizing: border-box;
    .menu-item,.node-item{
      position: relative;
      float: left;
      left: 0;
      display:flex;
      align-items:center;
      height: 30px;
      text-align: center;
      font-size: 12px;
      padding: 0 10px;
      transition: all 218ms;
      border-radius: 2px;
    }
    .el-button--text{
      color: black;
    }
    .el-button.is-disabled{
      color: #C0C4CC;
    }
    .node-item:hover{
      color: #3F80AE;
      background: #DEE8F7;
      cursor: pointer;
    }
    .undo::before{
      @include iconfont;
      content: '\e633';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .redo::before{
      @include iconfont;
      content: '\e627';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .zoom-in::before{
      @include iconfont;
      content: '\e898';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .zoom-out::before{
      @include iconfont;
      content: '\e897';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .position::before{
      @include iconfont;
      content: '\e60c';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .size::before{
      @include iconfont;
      content: '\e718';
      position: relative;
      left:0;
      width: 100%;
      height:100%;
    }
    .menu-line {
      position: relative;
      float: left;
      top: 5px;
      left: 0;
      width: 0.7px;
      height: 20px;
      margin: 0 10px;
      box-sizing: border-box;
      background: #A0A0A0;
    }
  }
}
</style>
