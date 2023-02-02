<template>
  <div class="container">
    <div class="container-title">
      <div class="title-name">
        {{ customComponent.label }}
      </div>
      <div class="title-conditions" @click="showJudgeList(customComponent)">
        {{ selectedItem.label }}
        <i class="icon-wf-caretdown iconfont" />
        <div v-if="curJudge === customComponent.renderKey" class="list-box">
          <div
            v-for="(item,index) in customComponent.judgeList "
            :key="index"
            class="list-item"
            @click.capture.stop="selectItem(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <!-- 为空或不为空作为条件时，该选项不显示 -->
    <div v-show="showContent">
      <div
        v-show="customComponent.componentFormat === 'input'"
        class="content"
      >
        <el-input
          v-show="selectedItem.value !== 4 && selectedItem.value !== 5"
          v-model="content"
          @change="saveData"
        />
      </div>
      <div
        v-show="customComponent.componentFormat === 'select'"
        class="content"
      >
        <!-- 单选列表 -->
        <el-select
          v-show="!isMultipleSelect"
          v-model="content"
          @change="saveData"
        >
          <el-option
            v-for="item in customComponent.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 多选列表 -->
        <el-select
          v-show="isMultipleSelect"
          v-model="contentAry"
          multiple
          placeholder="请选择"
          @change="saveDataAry"
        >
          <el-option
            v-for="item in customComponent.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        v-show="customComponent.componentFormat === 'date'"
        class="content"
      >
        <el-date-picker
          v-show="!isRange"
          v-model="content"
          type="date"
          placeholder="选择日期"
          value-format="timestamp"
          @change="saveData"
        />
        <el-date-picker
          v-show="isRange"
          v-model="contentAry"
          type="daterange"
          range-separator="~"
          value-format="timestamp"
          @change="saveDataAry"
        />
      </div>
      <div
        v-show="customComponent.componentFormat === 'tree'"
        class="content"
      >
        <el-cascader
          v-model="content"
          :options="customComponent.options"
          @change="saveData"
        />
      </div>
      <div
        v-show="customComponent.componentFormat === 'none'"
        class="content"
      />
    </div>
  </div>

</template>

<script>
export default {
  props: {
    curJudge: {
      type: Number,
      default: -1
    },
    customComponent: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedItem: { label: '请选择', value: -1 },
      content: '',
      contentAry: [],
      contentDate: '',
      multipleSelectVal: [2, 3, 11, 12, 13, 14], // 这些值表示可以进行多选
      rangeVal: [10] // 这些值表示是范围选择,
    };
  },
  computed: {
    sendData: function() {
      return {
        content: this.content,
        renderKey: this.customComponent.renderKey,
        Judge: this.selectedItem.value
      };
    },
    showContent: function() {
      return this.selectedItem.value !== 4 && this.selectedItem.value !== 5;
    },
    isMultipleSelect: function() {
      return this.findVal(this.multipleSelectVal, this.selectedItem.value);
    },
    isRange: function() {
      return this.findVal(this.rangeVal, this.selectedItem.value);
    }
  },
  mounted() {
    Array.isArray(this.customComponent.condition.content) ? this.contentAry = this.customComponent.condition.content : this.content = this.customComponent.condition.content;

    // this.content = this.customComponent.condition.content;
    const initSelectJudge = this.customComponent.judgeList.find(options => {
      return options.value === this.customComponent.condition.Judge;
    });
    this.selectedItem = initSelectJudge || this.selectedItem;
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item;
      // 选择完关闭条件列表
      this.$parent.showJudge(-1);
      this.content = null;
      this.contentAry = null;
      this.$emit('saveComponent', this.sendData);
    },
    showJudgeList(item) {
      this.$emit('changeCurJudge', item.renderKey);
    },
    saveData(val) {
      this.content = val;
      console.log(this.sendData);
      this.$emit('saveComponent', this.sendData);
    },
    saveDataAry(val) {
      this.contentAry = val;
      this.$emit('saveComponent', {
        content: this.contentAry,
        renderKey: this.customComponent.renderKey,
        Judge: this.selectedItem.value
      });
    },
    findVal(ary, val) {
      return ary.find(item => {
        return item === val;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
  position: relative;
  padding: 15px 55px 15px 20px;
  box-sizing: border-box;
  font-size: 14px;
  &:hover{
    background:#E6F7F6;
  }
  .container-title{
    display:flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 30px;
    .title-name{
      padding-right: 5px;
    }
    .title-conditions{
      padding-left: 10px;
      width: auto;
      height: 32px;
      cursor: pointer;
      color: #0DB3A6;
      &:hover{
        background:#fff;
      }
      .list-box{
        position: absolute;
        z-index: 10;
        // transform: translate(-30px, 0px);
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 1px 8px 0 rgb(0 0 0 / 15%);
        margin: 2px 0;
        max-width: 240px;
        min-width: 160px;
        max-height:250px;
        padding: 5px 0px;
        overflow: auto;
        .list-item{
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          padding: 0 4px;
          &:hover{
            color: #fff;
            background-color: #0DB3A6;
          }
        }
      }
    }
  }
  .content{
    margin-top: 3px;
  }
}
>>>.el-date-editor--daterange.el-input__inner {
  width: auto !important;
}
>>>.el-date-editor .el-range-input{
  font-size: 12px !important;
}
</style>
