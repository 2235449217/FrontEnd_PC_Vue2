<template>
  <div id="container">
    <div class="container-title">
      {{ nodeData.type !== 'customEdge'?'节点属性':'节点连接线' }}
      <!-- 节点属性 -->
    </div>
    <div class="container-config">
      <CommonNode v-show="nodeData.type !== 'customEdge'" :lf="lf" :node-data="nodeData" />
      <CommonEdge v-show="nodeData.type === 'customEdge'" :lf="lf" :node-data="nodeData" />
    </div>
    <!-- <el-tab-pane label="流程属性" name="second">
        <div v-show="nodeData.type === 'customEdge'">
          asd
        </div>
      </el-tab-pane> -->
  </div>
</template>

<script>
import CommonNode from './CommonNode';
import CommonEdge from './CommonEdge';

export default {
  components: { CommonNode, CommonEdge },
  props: {
    nodeData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    lf: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
    };
  },
  // watch: {
  //   nodeData: function(val) {
  //     console.log(val);
  //   }
  // },
  mounted() {
    // console.log(this.lf);
  }
};
</script>

<style lang="scss" scoped>
// @import "@/styles/tab.scss";
@import "@/styles/input.scss";

#container{
  position: relative;
  right: 0;
  width: 300px;
  border-left: solid 1px #e0e0e0;
  .container-title{
    width: 100%;
    height: 45px;
    text-align: center;
    line-height: 45px;
    border-bottom: solid 3px transparent;
    border-bottom-color: $tab-border-color;
  }
}
.container-config{
  padding: 0 10px 15px;
  position: absolute;
  top: 45px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
