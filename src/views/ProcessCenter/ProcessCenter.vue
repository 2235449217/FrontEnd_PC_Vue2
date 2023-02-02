<template>
  <div class="process">
    <!-- {{有流程的应用有四个我的，反之没有}} -->
    <!-- <h2>传递参数为： {{ paramsTask }}</h2> -->
    <base-nav>
      <!-- 点击为app时显示 -->
      <el-popover
        slot="btn"
        placement="bottom"
        trigger="click"
      >
        <ul class="x-menu">
          <li v-for="(item,index) in applist" :key="index" class="x-menu-item" @click="CutApp(item,index)">
            <span class="item-icon" :style="`background-image:linear-gradient(${item.from},${item.to})`">
              <i :class="item.icon" />
            </span>
            <span class="item-label">{{ item.name }}</span>
            <i v-if="$route.params.appID===JSON.stringify(item.id)" class="iconfont check-icon icon-wf-duigou" />
          </li>
        </ul>
        <div slot="reference" class="fx-app-switch">
          <div class="app-name">应用名称</div>
          <i class="iconfont icon-wf-caretdown" />
        </div>
      </el-popover>

    </base-nav>
    <div class="process_content">
      <div class="flow_left">
        <div class="flow-manage">
          <div v-for="(item,index) in flowTitle" :key="index" class="flow-node" :class="{selected_active:item.params===paramsTask}" @click="changeitem(item.params)">
            <div class="flow-content">
              <i :class="item.icon" :style="{'color':item.color}" class="iconfont" />
              <span>{{ item.name }}</span>
            </div>
            <div v-if="index===0" class="x-badge">
              <span class="badge-count">{{ todoNum }}</span>
            </div>
          </div>
          <div class="x-divider" />
          <!-- 标记位置 app没有发起新流程功能-->
          <div v-if="!isAPP" class="flow-node" :class="{selected_active:'launch'===paramsTask}" @click="initiate">
            <div class="flow-content">
              <i class="iconfont icon-wf-a-135fadexinliucheng" />
              <span>发起新流程</span>
            </div>
          </div>
          <!-- <div> {{ this.$route.path }}</div>
          <div> {{ this.$route.params.appID }}</div>
          <div> {{ this.$router.history.current.name }}</div> -->
        </div>
        <div v-if="isAPP" class="app-menu">
          <div class="menu-tool">
            <div class="popover_input">
              <div class="fow-search-input">
                <i class="iconfont icon-wf-sousuo" />
                <input type="text" placeholder="禁用状态" disabled="disabled">
              </div>
            </div>
            <div class="add-button">
              <button class="x-button">
                <i class="icon-wf-tianjia iconfont " />
                <span>新建</span>
              </button>
            </div>
          </div>
          <div class="app-entry-list">
            <div class="x-list-tree content-ellipsis">
              <div v-for="(item,index) in formdata" :key="index" class="tree-node" :class="{tree_node_active:ischecknode===index}" style="height: 40px;" @click="changenode(index)">
                <div class="node-indent">
                  <i class="iconfont icon-wf-biaodanpeizhi" />
                  <span>{{ item }}</span>
                </div>
                <el-dropdown trigger="click" @command="handleCommand">
                  <div class="node-content-wrapper">
                    <i class="iconfont icon-wf-shezhi1" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">编辑表单</el-dropdown-item>
                    <el-dropdown-item command="b">修改表单信息</el-dropdown-item>
                    <el-dropdown-item command="c">复制到当前应用</el-dropdown-item>
                    <el-dropdown-item command="d">删除</el-dropdown-item>
                    <el-dropdown-item command="e" divided>待开发</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 四个我的界面 -->
      <div v-if="paramsTask!=='launch'&&!checkform" class="flow_right">
        <div class="fx-flow-list-toolbar">
          <div class="left">
            我的代办
            <span class="count-info">(共{{ todolist.length }}条)</span>
          </div>
          <div class="right">
            <el-popover
              slot="btn"
              v-model="showSizer"
              placement="bottom"
              trigger="click"
            >
              <div class="popover-content">
                <div class="fx-filter-pane">
                  <div class="flow-app-filters">
                    <div class="fx-filter">
                      <div class="field-title">应用</div>
                    </div>
                    <div class="filter-widget">
                      <el-select v-model="app_Value" filterable placeholder="请选择">
                        <el-option
                          v-for="item in applist"
                          :key="item.value"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="content-footer" style="text-align: left; margin: 0">
                  <el-button size="small" type="text" @click="showSizer = false">筛选</el-button>
                  <el-button type="primary" size="small" @click="showSizer = false">清空</el-button>
                </div>
              </div>

              <div slot="reference" class="flow-btn select">
                <i class="icon-wf-shaixuan iconfont" />
                <div class="app-name">筛选</div>
              </div>
            </el-popover>
            <!-- 最新 -->
            <!-- <div class="flow-btn">
              <i class="icon-wf-zuixinchengji iconfont" />
              最新
            </div> -->
          </div>
        </div>
        <component-approval v-if="isComponentApproval" :forms="forms" :dynamics="dynamicDatas" :isend="idEnd" @close="close" />
        <div v-if="paramsTask!=='launch'&&!checkform" class="fx-flow-manage-list">
          <div class="x-list">
            <div v-for="(item,index) in todolist" :key="index" class="fx-flow-item" @click="showContent(item)">
              <div class="creator-info">
                <div class="x-avatar" style="width: 40px; height: 40px; line-height: 40px; font-size: 20px;">
                  <img :src="'https://www.cppwnn.top/api/'+headerImg" alt="">
                </div>
                <span class="name">{{ item.applicant }}</span>
              </div>
              <div class="state-info">
                <div class="entry-name">{{ item.appName }}</div>
                <div class="current-node">
                  当前:{{ item.currentNode }}
                </div>
              </div>
              <ul class="flow-brief">
                <li class="brief-item">
                  <div class="brief-label">审批状态</div>
                  <span class="sep">：</span>
                  <div class="brief-val">{{ item.checkState }}</div>
                </li>
                <li class="brief-item">
                  <div class="brief-label">审批人</div>
                  <span class="sep">：</span>
                  <div class="brief-val">{{ item.inspector }}</div>
                </li>
                <li class="brief-item">
                  <div class="brief-label">记录ID</div>
                  <span class="sep">：</span>
                  <div class="brief-val">{{ item.recordId }}</div>
                </li>
              </ul>
              <div class="flow-time">{{ item.createdAt }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发起流程界面 -->
      <div v-if="paramsTask==='launch'" class="flow_right">
        <div class="fx-flow-launch-pane">
          <div class="flow-app-list">
            <div class="app-item">
              <div class="app-title">所有应用</div>
              <div class="flow-entry-list">
                <div v-for="(item,index) in applist" :key="index" :style="`border-color: ${item.from}`" class="entry-item">
                  <div class="entry-name">{{ item.name }}</div>
                  <div class="entry-bottom" @click="InitiateProcess(item)">
                    <a href="#" class="entry-launch">
                      <span>发起流程</span>
                      <i class="icon-wf-youjiantou1 iconfont" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 应用表单界面 -->
      <div v-if="paramsTask!=='launch'&&checkform " class="flow_right">
        <!-- <div> {{ this.$route.path }}</div>
        <div> {{ this.$route.params }}</div>
        <div> {{ this.$router.history.current.name }}</div>
        几点开饭 -->
        <form-submission :appid="appId" />
      </div>
    </div>
    <!-- 筛选弹出框 -->
    <!-- <el-dialog
      :modal="false"
      title=""
      :visible.sync="isfiter"
    >
      <el-form :model="information">
        <el-form-item label="">
          <div>根据应用筛选</div>
          <el-select v-model="information.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="isfiter = false">筛选</el-button>
        <el-button size="small" @click="isfiter = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { getAppList } from '@/api/app';
import BaseNav from '@/components/BaseNav';
import componentApproval from '../../components/home/ComponentApproval';
import { getFormDatas, getProcessDynamiceDatas } from '@/api/formGenerator';
import { geteEmpty } from '@/api/app';

import { todo, create, transactors, ccusers } from '@/api/Task/task';
import { getUserInfo } from '@/api/System/user';
import formSubmission from '../../components/formgenerator/formSubmission.vue';

export default {
  components: { componentApproval, BaseNav, formSubmission },
  data() {
    return {
      todoNum: null,
      // 选中app默认索引
      appIndex: null,
      // 筛选框显示
      showSizer: false,
      headerImg: '',
      // 根据参数显示不同页面
      paramsTask: this.$route.params.task,
      // 选中状态
      ischecknode: null,
      // 所有应用
      applist: [],
      // 右侧下拉菜单选中值
      app_Value: '',
      // 当前页面应用
      todolist: [],
      flowTitle: [{
        name: '我的代办', params: 'todo', icon: 'icon-wf-lingdang', color: '#538bff'
      }, {
        name: '我发起的', params: 'create', icon: 'icon-wf-bofang', color: '#0db3a6'
      }, {
        name: '我处理的', params: 'transactors', icon: 'icon-wf-wochulide', color: '#ffc017'
      }, {
        name: '抄送我的', params: 'ccusers', icon: 'icon-wf-chaosongwode', color: '#4ec2e9'
      }],
      isfiter: false,
      // 判断当下点击的是否为应用 默认不是
      checkform: false,
      // 存放筛选信息
      information: {},
      // 存放当前应用下单个表单信息
      appForm: {},
      // 当前表单信息
      form: {},
      // 一个应用对应一个表单
      formdata: ['应用表单'],
      isComponentApproval: false,
      forms: '',
      dynamicDatas: '',
      isEnd: false,
      appId: ''
    };
  },
  computed: {
    // 判断是否为app
    isAPP() {
      if ('appID' in this.$route.params) {
        return true;
      }
      return false;
    }
  },
  watch: {
    // 监听是否切换app，并获取当前app下表单信息
    $route(to, form) {
      if ('appID' in to.params && (to.params['appID'] !== form.params['appID'])) {
        const data = {
          appId: ''
        };
        data.appId = to.params.appID;
        geteEmpty(data).then(res => {
          this.appForm = res.data;
          console.log(res);
        });
      }
    }
  },
  created() {
    getAppList().then(res => {
      this.applist = res.data;
      console.log(this.applist);
    });
    // 获取当前应用下的表单
    getUserInfo().then(res => {
      this.headerImg = res.data.userInfo.headerImg;
    });

    if (!('appID' in this.$route.params)) {
      const data = this.$route.params.task;
      if (data === 'todo') {
        todo().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            console.log(res);
            this.todolist = res.data;
          }
        });
      } else if (data === 'create') {
        create().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            console.log(res);
            this.todolist = res.data;
          }
        });
      } else if (data === 'transactors') {
        transactors().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            console.log(res);
            this.todolist = res.data;
          }
        });
      } else if (data === 'ccusers') {
        ccusers().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            this.todolist = res.data;
          }
        });
      }
    } else {
      todo().then(res => {
        this.todolist = res.data;
      });
    }
    this.paramsTask = this.$route.params.task;
    todo().then(res => {
      this.todoNum = res.data.length;
    });
  },
  methods: {
    CutApp(item, index) {
      this.$router.push('/app/' + item.id + '/process/todo');
      this.appIndex = item.id;
    },
    openAppList() {
      console.log('11');
    },
    close() {
      this.isComponentApproval = false;
    },
    // 路由跳转
    changeitem(params) {
      this.paramsTask = params;
      // 当前点击的不是表单
      this.checkform = false;
      // 清空点击状态
      this.ischecknode = null;
      if (params === 'todo') {
        todo().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            this.todolist = res.data;
          }
        });
      } else if (params === 'create') {
        create().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            this.todolist = res.data;
          }
        });
      } else if (params === 'transactors') {
        transactors().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            this.todolist = res.data;
          }
        });
      } else if (params === 'ccusers') {
        ccusers().then(res => {
          if (res.data === null) {
            this.todolist = [];
          } else {
            this.todolist = res.data;
          }
        });
      }
      console.table(this.todolist);
      if ('appID' in this.$route.params) {
        this.$router.push('/app/' + this.$route.params.appID + '/process/' + params);
      } else {
        this.paramsTask = params;
        this.$router.push('/process/' + this.paramsTask);
      }
    },
    changenode(index) {
      this.appId = this.$route.params.appID;
      // 当前点击为表单
      this.checkform = true;
      this.paramsTask = '';
      this.ischecknode = index;
      // 调用接口
      // this.
    },
    initiate() {
      this.paramsTask = 'launch';
      this.$router.push('/process/' + this.paramsTask);
    },
    fiterbox() {
      this.isfiter = true;
    },
    InitiateProcess(item) {
      // 返回的是当前应用信息;
      console.log(item);
    },
    showContent(item) {
      // 存放单个右侧展示的表单 信息
      this.form = item;
      console.log(this.form);
      // getFormDatas()
      //   .then((res) => {
      //     this.forms = JSON.parse(res.data).fields;
      //     console.log(this.forms, '请求成功01');
      //   })
      //   .catch((error) => {
      //     console.log(error, '请求失败');
      //   });
      // getProcessDynamiceDatas()
      //   .then((res) => {
      //     this.dynamicDatas = res.data.dynamics;
      //     console.log(this.dynamicDatas, '请求成功02');
      //   })
      //   .catch((error) => {
      //     console.log(error, '请求失败');
      //   });
      // 【审批组件】返回form数据接口
      console.log(this.$route.params.appID, '123456489');
      getFormDatas(this.$route.params.appID)
        .then((res) => {
          this.forms = JSON.parse(res.data).fields;
          // console.log(this.forms, '请求成功01');
        })
        .catch((error) => {
          console.log(error, '请求失败');
        });
      // 【审批组件】流程动态接口
      getProcessDynamiceDatas(this.$route.params.appID)
        .then((res) => {
          this.dynamicDatas = res.data.dynamics;
          if (res.data.dynamics) {
            this.isEnd = res.data.dynamics[0].isEnd;
          }
          // console.log(this.dynamicDatas, '请求成功02');
        })
        .catch((error) => {
          console.log(error, '请求失败');
        });

      // 开启关闭弹窗
      this.isComponentApproval = !this.isComponentApproval;
    },
    // 编辑表单方法
    handleCommand(command) {
      if (command === 'a') {
        // alert('handleCommand方法编辑表单');
      } else if (command === 'b') {
        // alert('handleCommand方法编辑表单');
      } else if (command === 'c') {
        // alert('handleCommand方法编辑表单');
      } else if (command === 'd') {
        // alert('handleCommand方法编辑表单');
      }
      this.$message({
        type: 'success',
        message: command + '请自定义handleCommand方法内容'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/color.scss';
//左侧应用筛选
.x-menu{
  max-height:500px;
  width: 350px;
  overflow: auto;
  padding-left: 0;
  margin: 0;
  .x-menu-item{
    padding: 0 0 0 12px;
    display: flex;
    align-items: center;
    line-height: 40px;
    list-style: none;
    &:hover{
      background-color:$address_option_color;
    }
    .item-icon{
      width: 20px;
      height: 20px;
      display: inline-block;
      flex: none;
      margin-right: 5px;
      font-size: 16px;
      line-height:20px;
      text-align: center;
      border-radius:4px;
      i{
        color: #fff;
      }
    }
    .item-label{
      max-width: 280px;
      width: 266px;
      margin-left: 10px;
      color: #5e6d82;
      font-size: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .check-icon{
      font-size: 21px;
      flex: flex-end;
      color: #0db3a6;
    }
  }
}
//右侧应用筛选
.popover-content{
  max-height:500px;
  width: 350px;
  overflow: auto;
  padding-left: 0;
  margin: 0;
  .fx-filter-pane{
    .flow-app-filters{
      .fx-filter{
        position: relative;
        padding: 0px 55px 0px 20px;
        .field-title{
          display: flex;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 30px;
        }
      }
      .filter-widget{
        margin-top: 5px;
        padding: 0px 55px 0px 15px;
      }
    }
  }
  .content-footer{
    padding: 15px 0 0 15px;
  }
}
//设置element ui el-select默认样式
::v-deep .el-select{
  .el-input{
    .el-input__inner{
      width: 300px;
      height: 30px;
      border-color:#d9d9d9;
      &:hover{
        border-color: $address_btn_color;
      }
    }
    .el-input__suffix{
      .el-input__suffix-inner{
        i{
          line-height:30px;
        }
      }
    }
  }
}
.fx-app-switch{
    margin-left: 15px;
    display: flex;
    align-items: center;
    padding: 0 5px;
    color: #1f2d3d;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    cursor: pointer;
    &:hover{
      background-color:#f1f1f1;
    }
    .app-name{
      max-width: 370px;
      padding-left: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon-wf-caretdown{
      margin-left: 10px;
      color: #91a1b7;
      font-size: 16px;
    }

}
// 选中状态
设置按钮中的下拉选项
::v-deep .el-dropdown{
  display:none !important;
  .el-dropdown-link {
  cursor: pointer;

}
}
.el-icon-arrow-down {
  font-size: 12px;
}
 ::v-deep .el-dropdown-menu__item{
    color:#1f2d3d;
    &:not(.is-disabled):hover{
      background-color: $address_option_color;
      color: #1f2d3d;
    }
  }
.selected_active{
  background-color:#e4e9f0;
}
.iconfont {
  font-family:"iconfont" !important;
  // color: $address_btn_color;
  font-size:16px;font-style:normal;
  margin-right: 10px;
}
.process{
  display: flex;
  flex-direction: column;
  height:100vh;
}
.footer {
  width: 100%;
  height: 60px;
    border-bottom: 1px solid #e9e9e9;
  background-color:rgb(255, 255, 255);
}
.process_content{
  flex-grow:1;
  display: flex;
   height:100%;
  .flow_left {
    position: relative;
    width:280px;
    background: #f4f6f9;
    height:100%;
    background: #f4f6f9;
    border-right: 1px solid #e2e2e2;
    border-left: 1px solid #e9e9e9;
    //宽度改变事件的过度
    transition: width .6s cubic-bezier(.19,1,.22,1);
    //禁止缩放
    flex: none;
    .flow-manage{
      flex: 0 0 180px;
      padding: 10px 0;
      overflow: hidden;
      .x-divider{
        margin: 10px 0;
        border: solid #e9e9e9;
        border-width: 1px 0 0;
      }
      .flow-node{
        // background-color: red;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height:40px;
        padding: 0 20px;
        cursor: pointer;
        .flow-content{
          font-size:14px;
          display: flex;
          align-items: center;
          .icon-wf-a-135fadexinliucheng{
            color: $address_btn_color;
          }
        }
        .x-badge{
          .badge-count{
            display: inline-block;
            height: 22px;
            padding: 0 8px;
            color: #fff;
            font-size: 12px;
            line-height: 22px;
            white-space: nowrap;
            text-align: center;
            background-color: #e64340;
            border-radius: 11px;
            box-shadow: 0 0 0 1px #fff;
          }
        }
      }
    }
    .app-menu{
        position: relative;
        box-sizing: border-box;
      .menu-tool{
        position: relative;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        height: 60px;
        padding: 15px 15px 15px 10px;

        box-sizing: border-box;
         .popover_input{
         position:absolute;
         line-height:26px;
         height:26px;
         border-radius: 13px;
         display: flex;
         border: none;

         .fow-search-input{
          display:flex;
          padding-left:30px;
          border-radius: 13px;
          background-color:#fff;
          width: 100%;

          input{
            width: 100%;
            padding: 4px 8px;
            font-size: 12px;
            line-height:26px;
            border-radius: 13px;
            display:inline-block;
            border: none;
            outline: none;
          }
          .icon-wf-sousuo{
            position: absolute;
            left: 17px;
            font-size: 14px;
          }
         }

       }
       .add-button{
         position: absolute;
         width: 73px;
         height: 24px;
         right: 10px;
         border:1px solid $address_btn_color;
         border-radius: 12px;
         box-sizing: border-box;
         padding-left: 13px;
         cursor: pointer;
         button{
          background: transparent;
          height:100%;
          width: 100%;
          display:flex;
          align-items: center;
          border: none;
          padding: 0;
          font-size: 12px;
          color: $address_btn_color;
          vertical-align: middle;
             .icon-wf-tianjia{
               margin-right: 0px;
             }
             span{
               margin-left: 5px;
             }
         }
       }
      }
      .app-entry-list{
        .x-list-tree{
          font-size:14px;
          display:block;
          min-width: 100%;
          height: 100%;
          overflow: auto;
          vertical-align: middle;
          .tree-node{
            padding: 0 12px 0 20px;
            // background-color: red;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 34px;
            line-height: 20px;
            cursor: pointer;
            transition: background-color .1s ease-in-out;
            &:hover{
              background-color:#ebeef2;
            }
            .node-indent{
              display:flex;
              justify-content:space-between;
              width: 90px;
              .iconfont{
                color:#f5a439 ;
              }
            }
            .node-content-wrapper{
              i{
                color: $address_btn_color;
              }
            }
          }
          //动态赋予颜色
          .tree_node_active{
              background-color:#ebeef2;
          }
        }
      }
    }
  }

  .flow_right{
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .fx-flow-list-toolbar{
      box-sizing:border-box;
      flex: none;
      width: 100%;
      height: 50px;
      margin: 0 auto;
      padding: 0 20px;
      // background-color: pink;
      align-items: center;
      display: flex;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #e2e2e2;
       font-size: 14px;
      .left{
        font-weight: 700;
        .count-info{
          padding-left: 2px;
          color: #f0ad4e;
          font-weight: 400;
        }
      }
      .right{
        display:flex;
        align-items: center;
        .select{
          color: #0db3a6;
          background-color: $address_option_color;
          i{
            font-weight: 600;
          }
        }
        .flow-btn{
          display:flex;
          height: 26px;
          margin-left: 10px;
          padding: 0 10px;
          font-size: 14px;
          line-height: 26px;
          border-radius: 3px;
          cursor: pointer;
          i{
            margin-right: 5px!important;
          }
        }
      }
    }
    .fx-flow-manage-list{
      height:100%;
      flex-grow: 1;

      .x-list{
        max-height:795px;
        overflow: scroll;
        box-sizing :border-box;
        // padding: 16px 20px 10px;
        padding: 12px 24px;
        .fx-flow-item{
          margin: 0 auto 8px;
          border: 1px solid #e9e9e9;
          border-radius: 3px;
          box-shadow: 0 0 8px 0 rgb(31 45 61 / 8%);
          position: relative;
          display: flex;
          height: 88px;
          padding: 0px 20px!important;
          display: flex;
          cursor: pointer;
          transition: box-shadow .2s ease-in-out,-webkit-box-shadow .2s ease-in-out;
          .creator-info{
            flex: 0 0 auto;
            width: calc(15.5vw - 32px);
            min-width: 168px;
            max-width: 268px;
            line-height: 88px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .x-avatar{
               margin: 0 10px 0 15px;
               background: #fff;
               display: inline-block;
              overflow: hidden;
              color: #fff;
              text-align: center;
              vertical-align: middle;
              border-radius: 50%;
              img{
                display: inline-block;
                width: 40px;
                height: 40px;
              }
            }
            .name{
              font-size:14px;
            }
          }
          .state-info{
            flex: 0 0 auto;
            width: calc(34.4vw - 188px);
            min-width: 252px;
            max-width: 472px;
            padding: 10px 0;
            .entry-name{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 16px;
              line-height: 22px;
            }
            .current-node{
              margin-top: 20px;
              color: #91a1b7;
              font-size: 13px;
              line-height: 18px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .flow-brief{
            flex: 1 1 auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin: 5px 0 !important;
            .brief-item{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: flex;
              height: 24px;
              font-size: 13px;
              line-height: 22px;
              .brief-label{
              flex: none;
              display:inline-block;
              max-width: 100px;
              color: #91a1b7;
              vertical-align:top
              }
              .sep{
                 color: #91a1b7;
              }
              .brief-val{
                display: inline-block;
                flex: auto;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size:13px;
                line-height: 24px;
              }
              }
          }
          .flow-time{
            flex: 0 0 auto;
            width: calc(18.7vw - 112px);
            min-width: 155px;
            max-width: 248px;
            padding-top: 4px;
            color: #91a1b7;
            font-size: 13px;
            text-align: right;
          }

        }
      }
    }
    .fx-flow-launch-pane{
      font-size: 14px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
    .flow-app-list{
      height:100%;
      box-sizing:border-box;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 15px 15px 10px;
      .app-item{
        .app-title{
          padding-top: 10px;
          line-height: 40px;
          border-bottom: 1px solid #e0e0e0;

        }
        .flow-entry-list{
          .entry-item{
            position: relative;
            display: inline-block;
            cursor: pointer;
            width: 200px;
            height: 110px;
            margin: 10px 50px 15px 0;
            background: #fff;
            border-top: 6px solid;
            border-radius: 4px;
            box-shadow: 0 0 8px 0 rgb(31 45 61 / 8%);
            &:hover{
               box-shadow: 0 0 5px 5px rgb(31 45 61 / 8%);
            }
            .entry-name{
              padding: 0 10px;
              line-height: 60px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .entry-bottom{
              position: absolute;
              right: 10px;
              bottom: 0;
              left: 10px;
              text-align: right;
              border-top: 1px solid #e9e9e9;
              .entry-launch{
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                height: 38px;
                color: #178cdf;
                font-size: 12px;
                cursor: pointer;
                span{
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
      }
    }

  }
}
// 筛选框
::v-deep .el-dialog__wrapper{
  // width: 0;3
  // width: 350px !important;

  .el-dialog{
    position: absolute;
    left: 1471px;
    top: 23px;
    color: #1f2d3d;
    font-size: 12px;
    line-height: 18px;
    background: #fff;
    border-radius: 3px;
    width: 350px !important;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 20%);
    .el-dialog__body{
      padding: 10px 20px 10px 20px;
      .el-form{
        .el-form-item{
          border-bottom: 1px solid #d9d9d9;
          .el-form-item__content{
            .el-select{
              width: 264px;
              height: 30px;
              .el-input{
                .el-input__inner{
                  height:30px;
                }
              }
            }
          }
        }
      }
    }
    .el-dialog__footer{
      padding: 0px 20px 20px;
      .dialog-footer{
        text-align: left;
         button:nth-child(2){
          // background-color:$address_btn_color;
          border: 0px;
          color:#3f80ae ;
          &:hover{
            background-color:rgb(255, 255, 255)
          }
        }
        button:nth-child(1){
          color:rgb(255, 255, 255) ;
          background-color:$address_btn_color;
          border-color: $address_btn_color;
        }
      }
    }
  }
}

</style>
