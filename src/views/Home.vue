<template>
  <div>
    <BaseNav />
    <!-- 点击事件为了能够点击其他地方移除修改列表的list -->
    <div
      id="work-bench-bg"
      @click.capture="curList = -1"
    >
      <div class="work-bench-container">
        <!-- 流程导航选项 -->
        <div class="custom-dash-block">
          <div class="flow-center-wrapper">
            <div class="border-box">
              <SingleItem type="todo" :todo-num="todoNum" />
            </div>
            <div class="flow-steps">
              <MultipleItem :icon-url="require('../assets/start.png')" describe="我发起的" type="create" />
              <MultipleItem :icon-url="require('../assets/dell.png')" describe="我处理的" type="transactors" />
              <MultipleItem :icon-url="require('../assets/sendMe.png')" describe="我收到的" type="ccusers" />
            </div>
            <div
              class="border-box"
              @click.capture.stop="toAdd"
            >
              <MultipleItem
                :icon-url="require('../assets/start.png')"
                describe="创建应用"
              />
            </div>
          </div>
        </div>
        <!-- app列表 -->
        <div class="custom-dash-block">
          <div class="list-main">
            <div
              v-for="(item, index) in items"
              :key="index"
              :class="`app-item ${curList === index ? 'app-item-selected' : ''}`"
              @click="intoApp(item)"
            >
              <CustomItem
                :icon-name="item.icon"
                :color-from="item.from"
                :color-to="item.to"
                :describe="item.name"
              />
              <div
                v-show="curList === index"
                class="list"
              >
                <div
                  class="list-item"
                  @click.stop="toEdit(item)"
                >修改应用信息</div>
                <!-- <div class="list-item" @click.stop="test">复制应用</div> -->
                <div
                  class="list-item"
                  @click.stop="doDelete(item)"
                >删除应用</div>
              </div>
              <div
                :class="`option iconfont icon-wf-shezhi1 ${curList === index ? 'option-selected' : ''}`"
                @click.stop="curList === -1 ? curList = index : curList = -1"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 点击创建应用的弹出框 -->
      <el-dialog
        class="dialog-container"
        :title.sync="title"
        :visible.sync="checkStatus.add > 0 || checkStatus.edit > 0"
        :close-on-click-modal="false"
        :show-close="false"
        width="527px"
      >
        <!-- 外层弹框 -->
        <div class="list-item">
          <span class="item-label">
            应用名称
          </span>
          <el-input
            v-model="curOptions.appName"
            size="medium"
            class="item-content"
            placeholder="给应用命名，例如&quot;客户端管理系统&quot;"
          />
        </div>
        <div class="list-item">
          <span class="item-label">
            应用图标
          </span>
          <div
            class="item-content-box"
            @click.capture="innerVisible = true"
          >
            <CustomItem
              class="item-content"
              :show-text="false"
              :icon-name="curOptions.curName"
              :color-from="curOptions.curFrom"
              :color-to="curOptions.curTo"
            />
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="cancel">取 消</el-button>
          <el-button
            type="primary"
            :loading="checkStatus.add === 2 || checkStatus.edit === 2"
            size="medium"
            @click="submit"
          >确认</el-button>
        </div>
        <!-- 内层弹框 -->
        <el-dialog width="320px" title="图标选择" :visible.sync="innerVisible" append-to-body>
          <div class="color-container">
            <div v-for="(item, index) in colors" :key="index" @click="checkColor(item, index)">
              <ColorPicker :from="item.from" :to="item.to" :selected="curOptions.curPicker === index" />
            </div>
          </div>
          <div class="example-box">
            <div
              v-for="(item, index) in iconNames"
              :key="index"
              class="icon-examples"
              @click="$set(curOptions, 'curName', item)"
            >
              <CustomItem
                :show-text="false"
                :icon-name="item"
                :color-from="curOptions.curFrom"
                :color-to="curOptions.curTo"
              />
            </div>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import UserAvatar from '@/components/UserAvatar.vue';
import { createApp, getAppList, updateApp, deleteApp } from '@/api/app';
import BaseNav from '@/components/BaseNav.vue';
import SingleItem from '@/components/home/SingleItem';
import MultipleItem from '@/components/home/MultipleItem';
import CustomItem from '@/components/home/CustomItem';
import ColorPicker from '@/components/home/ColorPicker';
import { colors } from '@/components/home/linearGradientMap';
import { iconNames } from '@/components/home/IconName';
import { todoNum } from '@/api/Task/task';

const statusMap = {
  NORMAL: 0,
  PREPARED: 1,
  PROCESSING: 2
};

export default {
  name: 'Home',
  components: { BaseNav, SingleItem, MultipleItem, CustomItem, ColorPicker },
  data() {
    return {
      innerVisible: false,
      items: [],
      // 颜色列表
      colors: colors,
      // 图表列表
      iconNames: iconNames,
      // 表单选项默认值
      defaultOptions: {
        appId: null,
        appName: '未命名的应用',
        curPicker: 0,
        curName: 'el-icon-s-claim',
        curFrom: '#f4cf54',
        curTo: '#e89121'
      },
      // 表单选项当前值
      curOptions: {
        appId: null,
        appName: null,
        curPicker: null,
        curName: null,
        curFrom: null,
        curTo: null
      },
      // 当前处于哪种状态
      checkStatus: {
        add: statusMap.NORMAL,
        edit: statusMap.NORMAL
      },
      // 待办数
      todoNum: 0,
      curList: -1
    };
  },
  computed: {
    // 动态获取表单标题
    title () {
      return this.checkStatus.add > statusMap.NORMAL ? `创建空白应用` : this.checkStatus.edit > statusMap.NORMAL ? `修改应用信息` : '应用信息';
    },
    showList: {
      get: function () {
        return this.curList === this.listIndex;
      },
      set: function (newVal) {
        this.curList = newVal;
      }
    }
  },
  created() {
    console.log(this.$store.getters);
    this.updateAppList();
    todoNum().then(res => {
      this.todoNum = res.data;
    });
  },
  methods: {
    intoApp(item) {
      this.$router.push('/app/' + item.id + '/process/todo');
    },
    // 切换颜色
    checkColor(item, index) {
      this.$set(this.curOptions, 'curPicker', index);
      this.$set(this.curOptions, 'curFrom', item.from);
      this.$set(this.curOptions, 'curTo', item.to);
    },
    updateAppList() {
      getAppList().then(res => {
        console.table(res);
        this.items = res.data;
      });
    },
    toAdd () {
      // 取消选项列表显示
      this.curList = -1;
      // 添加前先重置表单
      this.resetForm();
      // 设置当前状态为准备添加状态
      this.checkStatus.add = statusMap.PREPARED;
    },
    toEdit (item) {
      console.log(item);
      // 取消选项列表显示
      this.curList = -1;
      // 解构选中item到当前配置
      ({ ...this.curOptions } = {
        appId: item.id,
        appName: item.name,
        curPicker: null,
        curName: item.icon,
        curFrom: item.from,
        curTo: item.to
      });
      // 设置当前状态为准备添加状态
      this.checkStatus.edit = statusMap.PREPARED;
    },
    doAdd () {
      this.checkStatus.add = statusMap.PROCESSING;
      const data = {
        name: this.curOptions.appName,
        icon: this.curOptions.curName,
        from: this.curOptions.curFrom,
        to: this.curOptions.curTo
      };
      createApp(data).then(res => {
        this.checkStatus.add = statusMap.NORMAL;
        // 创建成功，跳转进入新创建的应用
        this.toForm(res.data.appId);
      }).catch(err => {
        return err;
      });
    },
    doEdit () {
      this.checkStatus.edit = statusMap.PROCESSING;
      const data = {
        appId: this.curOptions.appId,
        name: this.curOptions.appName,
        icon: this.curOptions.curName,
        from: this.curOptions.curFrom,
        to: this.curOptions.curTo
      };
      updateApp(data).then(() => {
        this.checkStatus.edit = statusMap.NORMAL;
        this.updateAppList();
      }).catch(err => {
        return err;
      });
    },
    doDelete (item) {
      this.$confirm(`是否删除 ${item.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApp({ appId: item.id }).then(() => {
          this.updateAppList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    submit() {
      if (this.checkStatus.add === statusMap.PREPARED) {
        this.doAdd();
      } else if (this.checkStatus.edit === statusMap.PREPARED) {
        this.doEdit();
      }
    },
    cancel() {
      // 重置为初始状态
      this.checkStatus.add = statusMap.NORMAL;
      this.checkStatus.edit = statusMap.NORMAL;
      // 重置表单,防止数据显示一异常
      this.resetForm();
    },
    resetForm () {
      // 解构恢复默认值
      ({ ...this.curOptions } = { ...this.defaultOptions });
    },
    toForm(appid) {
      // 只有在创建应用时才会有包含 new 而不是appid
      this.$router.push({
        path: `/editflow/${appid}/form`,
        query: {
          appName: this.curOptions.appName
        }
      });
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/home.scss';
@import '@/styles/button.scss';
@import '@/styles/input.scss';
</style>
