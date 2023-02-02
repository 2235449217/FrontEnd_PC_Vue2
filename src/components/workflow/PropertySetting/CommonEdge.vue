<template>
  <div class="container" @click.capture="curJudge = -1;choseType = false;">
    <div class="condition-type">
      <div class="title">
        数据流转条件
      </div>
      <el-select v-model="selectedCondition" popper-class="custom-select" size="small">
        <el-option
          v-for="item in conditionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-show="selectedCondition===0">
      <span class="tip">当数据满足流转条件时，进入这条连接线下的节点；不添加流转条件时，所有数据都会进入这条连接线下的节点。</span>
      <div class="cfg_split" />
      <div class="conditions-box">
        <div class="conditions-filter">
          <span>符合以下</span>
          <div
            v-show="choseType"
            class="list"
          >
            <div
              class="list-item"
              @click.stop="isAll = true;choseType = false"
            >所有</div>
            <!-- <div class="list-item" @click.stop="test">复制应用</div> -->
            <div
              class="list-item"
              @click.stop="isAll = false;choseType = false"
            >任意</div>
          </div>
          <div class="list-btn" @click.stop="choseType = !choseType">
            {{ typeVal }}
          </div>
          <span>流转条件的数据</span>
        </div>
        <div class="field-add-btn">
          <!-- 点击添加流转条件的弹出框 -->
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
          >
            <!-- 添加流转条件多选列表 -->
            <el-select
              v-model="selectedComponents"
              size="small"
              :popper-append-to-body="false"
              collapse-tags
              filterable
              multiple
              placeholder="请选择"
              @change="updateSelectedComponents"
            >
              <el-option
                v-for="item in formComponents"
                :key="item.renderKey"
                :label="item.label"
                :value="item.renderKey"
              />
            </el-select>
            <span slot="reference" class="btn">+ 添加流转条件</span>
          </el-popover>
        </div>
        <div class="conditions-items-box">
          <!-- key值不同保证更新子组件的值 -->
          <componentsCard
            v-for="item in selectedComponentsAry"
            :key="JSON.stringify(item.condition)"
            :custom-component="item"
            :cur-judge="curJudge"
            @changeCurJudge="showJudge"
            @saveComponent="saveComponent"
          />
        </div>
      </div>
    </div>
    <div v-show="selectedCondition === 1">
      <span class="tip">当数据不满足同级的其他流转条件时，进入这条连接线下的节点。</span>
      <div class="cfg_split" />
    </div>
  </div>
</template>

<script>
import componentsCard from '@/components/workflow/PropertySetting/componentsCard';
import { getComponentMap } from '@/utils/adpterForForm';
import Cookies from 'js-cookie';
export default {
  components: { componentsCard },
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
      // conditions: [],
      conditionOptions: [{
        value: 0,
        label: '使用自定义流转条件'
      }, {
        value: 1,
        label: '使用Else条件'
      }],
      choseType: false,
      isAll: false,
      selectedCondition: 0,
      formComponents: [],
      componentsMap: null,
      selectedComponents: [],
      selectedComponentsAry: null,
      curJudge: -1,
      form: null,
      saveMap: new Map()
    };
  },
  computed: {
    typeVal: function() {
      return this.isAll ? '所有' : '任意';
    }
  },
  watch: {
    // 边更新后初始化数据
    nodeData: function(val) {
      if (val.type === 'customEdge') {
        this.initEdgeData(val);
      }
    }
  },
  created() {
    this.componentsMap = getComponentMap(!this.$store.getters.form.fields ? Cookies.get('formData') : this.$store.getters.form.fields);
    // 获取表单数据并展示选择列表
    this.formComponents = [...this.componentsMap.values()];
  },
  methods: {
    // 保存数据到当前选中元素
    saveData() {
      const nodeData = this.$props.nodeData;
      nodeData.properties = this.$data.form;
      this.$props.lf.setProperties(nodeData.id, this.$data.form);
    },
    // 初始化边的条件数据
    initEdgeData(data) {
      // 提取自定义属性properties，并拷贝一份到当前实例
      const { properties } = data;
      if (properties) {
        this.$data.form = Object.assign({}, this.$data.form, properties);
      }
      // 更新当前选中项
      this.initSelectedItems(data);
      // 更新当前选中项对应的自定义组件
      this.initSelectedComponents(this.$data.form.conditions);
    },
    // 初始化选中项
    initSelectedItems(data) {
      // 切换后初始化选中项。
      this.selectedComponents = [];
      // 添加选中组件列表id
      data.properties.conditions.forEach(item => {
        this.selectedComponents.push(item.renderKey);
      });
    },
    // 初始化选中的组件
    initSelectedComponents(list) {
      const ary = [];
      // 遍历当前选中项，更新条件map和卡片数组
      for (const item of list) {
        // 此处需要深拷贝，componentsMap获取的是一份地址，直接操作会污染componentsMap
        const componentObj = Object.create(this.componentsMap.get(item.renderKey));
        componentObj.condition = item;
        ary.push(componentObj);
        // 初始化要保存的map
        this.saveMap.set(item.renderKey, item);
      }
      // 更新当前选中项对应的组件卡片数组
      this.selectedComponentsAry = ary;
    },
    // 更新当前选中项对应的自定义组件
    // 此方法在触发下拉列表事件时传入list
    // 使用renderKey，控制条件组件的展示
    updateSelectedComponents(list) {
      const ary = [];
      const idMap = new Map();
      // 遍历当前选中项，更新条件map和卡片数组
      for (const item of list) {
        // 此处需要深拷贝，componentsMap获取的是一份地址，直接操作会污染componentsMap
        const componentObj = Object.create(this.componentsMap.get(item));
        componentObj.condition = this.saveMap.get(item) ? this.saveMap.get(item) : {
          Judge: -1,
          content: null,
          renderKey: item
        };
        ary.push(componentObj);
        idMap.set(item, this.saveMap.get(item));
      }
      // 更新要存入节点的组件id,组件的value为undefined。当卡片值更新后再更改id对应的value
      this.saveMap = idMap;
      this.form.conditions = [...this.saveMap.values()].filter(item => {
        if (item && item.judge !== -1) {
          // 选择了条件
          if (item.judge === 4 || item.judge === 5) {
            // 条件是 为空 和 不为空 不需要content有值
            return item;
          } else if (item.content !== '' && item.content !== null && item.content !== undefined) {
            // 其他条件content必须有值才通过过滤
            return item;
          }
        }
      });
      // 更新当前选中项对应的组件卡片数组
      this.selectedComponentsAry = ary;
      this.saveData();
    },
    // 展示哪个组件显示列表
    showJudge(e) {
      this.curJudge = Number(e);
    },
    // 新添加的组件卡片值被修改后触发
    saveComponent(conditions) {
      const judge = conditions.Judge;
      const renderKey = conditions.renderKey;
      if (judge !== -1) {
        this.saveMap.set(renderKey, conditions);
      }
      this.form.conditions = [...this.saveMap.values()].filter(item => {
        if (item && item.judge !== -1) {
          // 选择了条件
          if (item.judge === 4 || item.judge === 5) {
            // 条件是 为空 和 不为空 不需要content有值
            return item;
          } else if (item.content !== '' && item.content !== null && item.content !== undefined) {
            // 其他条件content必须有值才通过过滤
            return item;
          }
        }
      });
      this.saveData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/input.scss";
@import '@/styles/mixin.scss';
.title{
  line-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
.tip{
  font-size: 12px;
  color: #555;
}
.conditions-box{
  display:flex;
  flex-direction: column;
  z-index:11;
  .conditions-filter{
    font-size: 14px;
    height:30px;
    line-height:30px;
    color: #5e6d82;
    padding: 0 10px ;
  }
  .conditions-items-box{
    position:absolute;
    overflow: auto;
    top: 240px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index:10
  }
  .field-add-btn{
    line-height:40px;
    padding-left: 10px;
    height: 40px;
    color: #0DB3A6;
    .btn{
      &:hover{
        color: #0a837a;
      }
      cursor:pointer;
    }
  }
}
.condition-type{
  margin-bottom: 10px;
}
.cfg_split {
    border-top: solid 1px #e1e1e1;
    height: 0;
    margin: 15px 0;
}

.list{
  position: absolute;
  transform:translate(80px,0);
  color: #1f2d3d;
  background: #fff;
  border-radius: 3px;
  padding: 4px 0;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 20%);
  z-index: 100;
  cursor: pointer;
  .list-item:nth-child(2){
    color: $list-waring-text;
  }
  .list-item{
    display: flex;
    align-items: center;
    margin: 0 4px;
    padding: 0 16px;
    border-radius: 3px;
    height: 36px;
    &:hover{
      background: $list-hover;
    }
  }
}
.list-btn{
  display: inline-block;
  color: #0DB3A6;
  padding: 3px 10px 3px 10px;
  cursor: pointer;
  &:hover{
    background: #F4F4F4;
  }
  &:after{
    @include iconfont;
    content:'\e6d6';
    position: relative;

    box-sizing: border-box;
    font-size: 16px;
    color: #0DB3A6;
  }
}
>>>.el-form-item__label{
  font-weight: 700;
  padding:0;
}

>>>.el-select{
  width: 100%;
}

</style>
