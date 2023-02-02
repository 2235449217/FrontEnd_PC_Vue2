<template>
  <!-- 角角色 部门 列表需要在父组件内传递 不然在弹窗子组件内传递的话 异步加载不出来 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="648px"
  >
    <!-- 组织架构000 角色001 成员002 -->
    <div class="popover">
      <ul class="popover_top">
        <li v-for="(value,key) in map" :key="key" class="popover_top_item">
          <i class="iconfont" :class="{'icon-wf-pc_tree':value[0].slice(0,3)==='000'}" />
          <i class="iconfont" :class="{'icon-wf-jiaose1':value[0].slice(0,3)==='001'}" />
          <span v-if="`${value[0].slice(0,3) ==='000'}`">{{ value[1]["deptName"] }}</span>
          <span v-if="`${value[0].slice(0,3) ==='001'}`">{{ value[1]["authorityName"] }}</span>
          <span v-if="`${value[0].slice(0,3) ==='002'}`">{{ value[1]["nick_name"] }}</span>
        </li>
      </ul>
      <div class="popover_center">
        <div class="popover_center_header">
          <div class="tab-control">
            <div v-for="(item,index) in titles" :key="index" :class="{active_item:item===check_item}" class="tab-control-item" @click="changeitem(item)">
              {{ item }}
            </div>
          </div>
          <div class="popover_input" :class="{maxInput:maxInput===true}">
            <div class="fow-search-input">
              <i class="iconfont icon-wf-sousuo" />
              <input type="text" placeholder="搜索" @focus="getfocus" @blur="leavefocus">
              <i v-if="maxInput===true" class="iconfont icon-wf-a-guanbi1" />
            </div>
          </div>
        </div>
        <div class="popover_center_content">
          <div v-show="'组织架构'===check_item" class="department-tree">
            <el-tree
              ref="tree"
              :data="deptlist"
              :props="{ label:'deptName',id:'ID' }"
              show-checkbox
              node-key="ID"
              current-node-key
              :highlight-current="true"
              show-checkpopover
              :check-on-click-node="true"
              :check-strictly="true"
              default-expand-all
              :expand-on-click-node="false"
              @check-change="StructureCheck"
            >
              <span slot-scope="{ node}" class="custom-tree-node">
                <i class="iconfont">&#xe604;</i>
                {{ node.label }}
              </span>
            </el-tree>
          </div>
          <div v-show="'角色'===check_item" class="department-tree">
            <div class="role-item-box">
              <div class="role-item" @click="show3 = !show3">
                <i v-if="show3" class="iconfont icon-wf-wenjianjia" />
                <i v-if="!show3" class="iconfont icon-wf-weidaqiadewenjianjia" />
                <span>角色</span>
              </div>
              <div>
                <el-collapse-transition>
                  <div v-show="show3">
                    <el-checkbox-group
                      v-model="checkauthority"
                    >
                      <el-checkbox
                        v-for="(item,index) in authoritylist"
                        :key="index"
                        :label="JSON.stringify(item)"
                        @change="val=>SelectAuthority(val,index,item)"
                      >
                        <div>
                          <i class="iconfont icon-wf-jiaose1" />
                          {{ item.authorityName }}
                        </div>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-collapse-transition>
              </div>
            </div>

          </div>
          <div v-show="'成员'===check_item" class="department-tree">
            <div class="treeList_left">
              <div class="treeList_all">全部成员</div>
              <el-tree
                ref="tree2"
                :data="deptlist"
                :props="{ label:'deptName',id:'ID' }"
                node-key="id"
                :highlight-current="true"
                :check-on-click-node="true"
                :check-strictly="true"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{node}" class="custom-tree-node">
                  <i class="iconfont">&#xe604;</i>
                  {{ node.label }}
                </span>
              </el-tree>
            </div>
            <div class="treeList_right">
              <div class="treeList_all">
                <div>已选/{{ memberlist.length }}</div>
                <el-checkbox v-model="checkAll" @change="handleCheckAll" />
              </div>
              <el-checkbox-group
                v-model="checkMember"
                @change="handleCheckedRoleChange"
              >
                <el-checkbox
                  v-for="(item,index) in memberlist"
                  :key="index"
                  :label="JSON.stringify(item)"
                  @change="val=>SelectMember_dept(val,index,item)"
                >{{ item.nick_name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>

      <div class="popover_bottom">
        <div class="popover_bottom_left" @click="Toaddress">
          <el-button v-if="isaddress" size="small">通讯录</el-button>
        </div>
        <div class="popover_bottom_right">
          <el-button size="small" @click="cancelSend">取消</el-button>
          <el-button size="small" @click="submit">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getUserBydepartment } from '@/api/System/user';
export default {
  name: 'DialogBox',
  components: {

  },
  props: {
    // 弹出标题
    title: {
      type: String,
      default: '提示'
    },
    // 选项卡 部门 角色 用户
    titles: {
      type: Array,
      default() {
        return [];
      }
    },
    // 弹出框的显示状态
    show: {
      type: Boolean,
      default: false
    },
    // 弹出框宽度
    width: {
      type: String,
      default: '30%'
    },
    // 部门列表
    deptlist: {
      type: Array,
      default() {
        return [];
      }
    },
    // 角色列表
    authoritylist: {
      type: Array,
      default() {
        return [];
      }
    },
    // todo 获取所有成员
    allmember: {
      type: Array,
      default() {
        return [];
      }
    },
    // app应用信息
    appinfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // 存放所有选中项c
      map: new Map(),
      // 角色内成员
      memberlist: [],
      // // 所有选中用户存放
      // checkallMeb: [],
      // 角色存放
      checkauthority: [],
      // 默认选择用户存放
      checkMember: [],
      // 角色列表文件夹是否展开
      show3: true,
      // 输入框聚焦状态
      maxInput: false,
      // tab栏选中项
      check_item: '',
      // 当前选中角色
      role: null,
      // 判断当前角色是否存在的一个标记位
      has: false,
      // 成员列表处理
      isIndeterminate: false,
      memberlistAll: [],
      // 处理全选
      checkAll: true,
      checkitem: [],
      checkedOptions: []
    };
  },
  computed: {
    isaddress() {
      if (this.titles.length > 1) {
        return true;
      }
      return false;
    },
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('updateShow', val); // visible 改变的时候通知父组件
      }
    }
  },
  created() {
    // 遍历传进来的 appinfo
    console.log(this.appinfo);
    if (this.titles.length === 3) {
      const data = [];
      // 解决
      this.$nextTick(function () {
        this.appinfo['dept'].forEach(res => {
          data.push(res);
        });
        this.$refs.tree.setCheckedKeys(data);
      });
      // 解决
      this.appinfo['role'].forEach(res => {
        this.authoritylist.forEach(item => {
          // console.log(item.authorityId + ' ' + res);
          if (item.authorityId === res) {
            this.map.set('001x' + item.authorityId, item);
            this.checkauthority.push(JSON.stringify(item));
          }
        });
      });
      // 遍历所有
      this.appinfo['memeber'].forEach(res => {
        this.map.set('002x' + '' + res.id, res);
        this.checkMember.push(JSON.stringify(res));
      });
    }
    if (this.titles[0] === '角色') {
      this.appinfo['role'].forEach(res => {
        this.authoritylist.forEach(item => {
          // console.log(item.authorityId + ' ' + res);
          if (item.authorityId === res) {
            this.map.set('001x' + item.authorityId, item);
            this.checkauthority.push(JSON.stringify(item));
          }
        });
      });
    }

    this.check_item = this.titles[0];
  },
  methods: {
    // 关闭
    handleClose(done) {
      this.$emit('update:show', false);
    },
    submit() {
      const data = {
        'dept': [],
        'role': [],
        'memeber': []
      };
      this.map.forEach((value, key) => {
        const num = key.slice(0, 3);
        if (num === '000') {
          data['dept'].push(value.ID);
        } else if (num === '001') {
          data['role'].push(value.authorityId);
        } else if (num === '002') {
          data['memeber'].push(value);
        }
        // data.push(res);
      });
      console.log(data);
      this.$emit('changeAppInfo', data);
      this.$emit('update:show', false);
    },
    // 取消
    cancelSend() {
      this.$emit('update:show', false);
    },
    // 通讯录跳转方法
    Toaddress() {
      this.$router.push('/dashboard');
    },

    getfocus() {
      this.maxInput = true;
    },
    leavefocus() {
      this.maxInput = false;
    },
    // tab栏切换
    changeitem(item) {
      this.check_item = item;
    },
    // 判断对当前部门下的全选状态
    getchecked(memberlist, that) {
      that.checkMember = [];
      that.checkAll = true;
      memberlist.forEach(res => {
        if (!(that.map.has('002x' + res.id))) {
          that.checkAll = false;
        } else {
          that.checkMember.push(JSON.stringify(res));
        }
      });
    },
    // 获取当前部门下用户
    handleNodeClick(data) {
      const val = { 'id': null };
      val.id = data.ID;
      getUserBydepartment(val).then(res => {
        this.memberlist = res.data;
        const that = this;
        this.$options.methods.getchecked(this.memberlist, that);
      });
      this.$forceUpdate();
    },
    // 处理组织架构选项->SET
    StructureCheck(data, checked, node) {
      if (checked) {
        this.map.set('000x' + data.ID, data);
      } else {
        this.map.delete('000x' + data.ID);
      }
      // 问题：为甚么 部门不回显 角色回显！！！
      this.$forceUpdate();
    },
    // 赋予角色APP权限（添加与删除逻辑，默认渲染逻辑根据用户的权限 在created中赋值）
    SelectAuthority(val, index, item) {
      // console.log(item);
      if (val) {
        this.map.set('001x' + item.authorityId, item);
      } else {
        this.map.delete('001x' + item.authorityId);
      }
      // 盒子颜色改变
      this.role = index;
    },
    // 删除选中角色json数据缓存
    delcheckMeb(item, that) {
      const data = [];
      that.checkMember.forEach(res => {
        if (JSON.parse(res).id !== item.id) {
          data.push(JSON.parse(res));
        }
      });
      that.checkMember = [];
      data.forEach(res => {
        that.checkMember.push(JSON.stringify(res));
      });
    },
    // 赋予用户APP权限
    SelectMember_dept(val, index, item) {
      if (val) {
        this.map.set('002x' + '' + item.id, item);
      } else {
        // 删除选中缓存
        this.map.delete('002x' + '' + item.id);
        const that = this;
        this.$options.methods.delcheckMeb(item, that);
      }
    },
    // 处理成员选中集合->SET
    handleCheckedRoleChange(value) {
      if (value.length === (this.memberlist.length)) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    handleCheckAll(val) {
      if (val) {
        this.memberlist.forEach(item => {
          this.map.set('002x' + '' + item.id, item);
          // 遍历选中JSON数组,查看是否拥有
          var reg = true;
          this.checkMember.forEach(res => {
            if (JSON.parse(res).id === item.id) {
              reg = false;
            }
          });
          if (reg) {
            this.checkMember.push(JSON.stringify(item));
          }
        });
      } else {
        this.checkMember.forEach(item => {
          this.map.delete('002x' + '' + JSON.parse(item).id);
        });
        this.checkMember = [];
      }
    },

    checkedCities() {
    }
  }
};
</script>

<style  lang="scss" scoped>
@import '@/styles/color.scss';
.tab-control{
  display: flex;
  .tab-control-item{
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
    padding: 0 5px;
    height:37px;
    line-height:37px;
    border-bottom:3px;
  }
  .active_item{
    border-bottom:3px solid $address_btn_color;
    color: $address_btn_color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
  .popover{
  height: 514px;
  padding: 0 auto;
  .popover_top{
    margin-top: 0;
    padding-left: 0;
    width: 610px;
    height: 80px;
    display:flex;
    flex-wrap:wrap;
    align-content: flex-start;
    align-items: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    .popover_top_item{
      display: inline-block;
      margin: 5px 0 0 5px;
      padding: 5px 10px;
      background: #f3f6fc;
      border-radius: 1px;
      .icon-wf-pc_tree{
         color:#fa0;
      }
      .icon-wf-jiaose1{
        color: #248af9;
      }
      .icon_left{
        width: 20px;
        height: 20px;
        color:#fa0;
      }.icon_right{
         width: 20px;
        height: 20px;
        color: gray;
      }
    }
  }
  .popover_center{
     border: 1px solid #d9d9d9;
     width: 610px;
     height: 380px;
     .popover_center_header{
       position: relative;
       width:100%;
       height: 39px;
       border-bottom: 1px solid #d9d9d9;
       align-items: center;
       .tab-control{
         margin-left:10px;
         height:39px;
       }
       .popover_input{
         position:absolute;
         margin-top: 5px;
         top: 0;
         right: 0;
         bottom: 0;
         line-height:26px;
         height:26px;
         width: 114px;
         display: flex;
         border: none;
         background-color: rgb(244, 244, 244);
         border-radius: 13px;
         .fow-search-input{
           width: 100%;
          position: relative;
          padding:0px 30px;
          input{
            width: 100%;
            border: none;
            outline: none;
            background-color:rgb(244, 244, 244);
          }
          .icon-wf-sousuo{
            position: absolute;
            left: 10px;
          }
          .icon-wf-a-guanbi1{
            position: absolute;
            right: 5px;
            bottom:0px;
            top: 0px;
          }
         }

       }
     }
  }
  .popover_bottom{
    padding-top:5px;
    text-align: right;
    display: flex;
    justify-content: space-between;
    .popover_bottom_left{
      button{
        &:hover{
          background-color:  rgb(233, 233, 233);
           border-color:rgb(233, 233, 233) ;
           color: #1f2d3d;
        }
        &:focus{
            background-color:  rgb(233, 233, 233);
           border-color:rgb(233, 233, 233) ;
           color: #1f2d3d;
        }
      }
    }
     .popover_bottom_right{
        button:nth-child(1){
          &:hover{
          background-color:  rgb(233, 233, 233);
          border-color:rgb(233, 233, 233) ;
          color: #1f2d3d;
          }
        }
         button:nth-child(2){
           background-color:$address_btn_color;
           color: white;
          &:hover{
          background-color: rgb( 86, 202, 193);

          }
        }
     }
  }

}
::v-deep .maxInput{
  width: 100% !important;
}
::v-deep .el-tree-node__content{
  height:26px !important;
}
::v-deep .department-tree{
  margin-top:5px;
  .el-tree{
    .el-tree-node{
      .el-tree-node__content{
        position: relative;
        .expanded{
            color: $address_btn_color;
        }
        .el-checkbox{
          position: absolute;
          right: 0;
        }
        .custom-tree-node{
          i{
            color: $address_btn_color;
          }
        }
      }
    }
  }
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: $address_option_color !important;
}
// /*节点失焦时的背景颜色*/
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color:  $address_option_color !important;
}
//展开折叠动画
  .role-item-box{
    .role-item{
      padding: 0 35px 0 15px;
      cursor: pointer;
      line-height:30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      i{
        color: $role_icon_color;
      }
      }
  }
  ::v-deep .el-checkbox-group{
    .el-checkbox{
      height: 30px;
      width: 100%;
      line-height: 30px;
      position: relative;
      display: flex;
      align-items: center;
      &:hover{
        background-color:$address_option_color;
      }
      .el-checkbox__input {
        position:absolute;
        right: 10px;
        &:hover{
          border-color:1px solid $address_btn_color;
        }
        .el-checkbox__inner{
            &:hover{
          border-color:1px solid $address_btn_color;
        }
        }
      }
      .el-checkbox__label{
          position:absolute;
          i{
            color: $role_icon_color;
            margin-right: 10px;
          }
      }
    }
}
//成员列表
  ::v-deep.department-tree{
      position: relative;
       .treeList_left{
         width: 50%;
         height: 341px;
         vertical-align: top;
         .treeList_all{
          color: $address_btn_color;
          height: 30px;
          text-align:left;
          line-height:30px;
          padding-left:14px;
         }
       }
       .treeList_right{
        width: 35%;
        right: 0px;
        height:100%;
        top: -5px;
        border-top: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
        position: absolute;
        font-size: 14px;
        .treeList_all{
          color: $address_btn_color;
          height: 30px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          line-height:30px;
          border-bottom: 1px solid #e9e9e9;
        }

       }
     }
::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #606266 !important;
}
//动态类
.active_role{
  background-color:  $address_option_color
}
</style>
