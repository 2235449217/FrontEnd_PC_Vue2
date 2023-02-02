<template>
  <div class="organization">

    <div class="contacts-layout-main">
      <div class="layout-menu">
        <div class="menu-header">
          <div class="menu-header-left" :class="{j_r_active:isshow===0}" @click="changejob">部门</div>
          <div class="menu-header-right" :class="{j_r_active:isshow===1}" @click="changerole">角色</div>
        </div>
        <div v-if="!isshow" class="menu-content">
          <div class="fx-organization-job">
            <!-- 部门子菜单 -->
            <div class="job-outline">成员</div>
            <div class="job-content">
              <div class="fx-organization-content" :class="{content_active:isContent===0}" @click="change_job_all">
                <span class="tab-content-inner">
                  <i class="iconfont">&#xe601;</i>
                  <span class="inner-text">全部成员</span>
                </span>
              </div>
              <div class="fx-organization-content" :class="{content_active:isContent===1}" @click="change_job_leave">
                <span class="tab-content-inner">
                  <i class="iconfont">&#xe601;</i>
                  <span class="inner-text">离职成员</span>
                  <span />
                </span>
              </div>
            </div>
            <div class="job-outline">部门</div>
            <div class="department-tree">
              <!-- 树级菜单   使用 scoped slot-->
              <el-tree
                :data="deptlist"
                node-key="id"
                :props="{ label: 'deptName',id:'ID' }"
                default-expand-all
                :expand-on-click-node="false"
                :highlight-current="showTree"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node,data}" class="custom-tree-node">
                  <i class="iconfont">&#xe604;</i>
                  {{ node.label }}
                  <el-dropdown trigger="click" size="medium" placement="bottom-start" @command="handleCommand(a,b)" @click="hande">
                    <span class="el-dropdown-link">
                      <i class="iconfont , showmenu" :class="{showfunc:data.ID===deptId}" @click="show_options">&#xe603;</i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="c">
                        <span @click="adddept(b)">添加子部门</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="d">
                        <span @click="deldept(a, b)">删除</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="e">
                        <span>修改名称</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span></el-tree>
            </div>
          </div>
        </div>
        <!-- right -->
        <div v-if="isshow" class="menu-content-job">
          <div class="fx-organization-job">
            <!-- 部门子菜单 -->
            <div class="job-outline">
              <div>创建的角色</div>
              <el-dropdown @command="showaddrole">
                <div class="job-outline-add">+</div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">
                    <span @click="addrole">创建角色</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="job-content">
              <div class="fx-organization-content">
                <div class="job-list" :job-List="authorityList">
                  <div class="job-list-item">
                    <div class="job-list-item-menu">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wf-role-list" />
                      </svg>
                      角色
                    </div>
                  </div>
                  <div v-for="(item,index) in authorityList" :key="index" class="job-list-item" :class="{item_Active:active===item.authorityId}" @click="change_item(item)">
                    <div class="job-list-item-left">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wf-jiaose" />
                      </svg>
                      <span>{{ item.authorityName }}</span>
                    </div>
                    <div class="job-list-item-right" @click="amendrole">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-wf-gongneng" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isContent!==1&&isshow===0&&!isloading" class="layout-content">
        <content-all
          :deptlist="deptlist"
          :check-mor-d="checkMorD"
          width="100%"
          :dept-id="deptId"
        />
      </div>
      <!-- 部门显示 -->
      <!-- <div v-if="isContent===3&&isshow===0&&deptId!==null&&!isloading" class="layout-content">
        <content-all
          :deptlist="deptlist"
          :check-mor-d="checkMorD"
          width="100%"
          :dept-id="deptId"
        />
      </div> -->
      <div v-if="isContent===1&&isshow===0&&deptId===null&&!isloading" class="layout-content">
        <content-leave :memberlist-all="memberlistAll">
          <div class="manager-group-name">
            离职成员
          </div>
        </content-leave>
      </div>

      <div v-if="isshow===1&&!isloading" class="layout-content">
        <content-role :memberlist-all="memberlistAll" :member-list="memberList" :authoritymsg="authoritymsg" :deptlist="deptlist">
          <div class="manager-group-name">
            角色管理
          </div>
        </content-role></div>
    </div>
    <!-- 弹出框 -->
    <div class="createauthority">
      <!-- 弹出框架 -->
      <el-dialog title="新增部门" :visible.sync="dialogFormVisible" label-width="150px" width="440px">
        <el-form :model="authorityForm">
          <el-form-item label="角色名" prop="pass">
            <el-input v-model="authorityForm.authorityName" autocomplete="off" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色级别" prop="pass">
            <el-input-number v-model="authorityForm.level" size="small" controls-position="right" :min="1" :max="10" @change="handleChange" />
            <!-- <el-input v-model="authorityForm.level" autocomplete="off" placeholder="请输入一个正整数作为角色级别,0为最高级" /> -->
          </el-form-item>
          <el-form-item label="数据范围" prop="pass">
            <el-select v-model="authorityForm.dataScope" placeholder="请选择" @change="handdataScope">
              <el-option label="全部" value="全部" />
              <el-option label="本级" value="本级" />
              <el-option label="自定义" value="自定义" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isRolebase" label="数据权限" prop="pass">
            <el-tree-select
              ref="treeSelect"
              v-model="authorityForm.deptId"
              :select-params="selectParams"
              :tree-params="treeParams"
              :tree-render-fun="renderFun"
              @searchFun="_searchFun"
              @node-click="_nodeClickFun"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="Submitfrom(authorityForm)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加部门弹出框 -->
      <el-dialog title="创建角色" :visible.sync="DepartmentEditBox" label-width="150px" width="440px">
        <el-form :model="authorityForm">
          <el-form-item label="父级部门" prop="pass">
            <el-input v-model="authorityForm.authorityName" autocomplete="off" disabled placeholder="根部门" />
          </el-form-item>
          <el-form-item label="部门排序" prop="pass">
            <el-input-number v-model="authorityForm.level" size="small" controls-position="right" :min="1" :max="10" @change="handleChange" />
            <!-- <el-input v-model="authorityForm.level" autocomplete="off" placeholder="请输入一个正整数作为角色级别,0为最高级" /> -->
          </el-form-item>
          <el-form-item label="部门名称" prop="pass">
            <el-input v-model="authorityForm.name" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="DepartmentEditBox = false">取 消</el-button>
          <el-button type="primary" @click="Submitfrom(authorityForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div></template>

<script>

import '@/icons/iconfont/iconfont.css';
import '@/icons/iconfont/iconfont.js';

import ContentAll from '@/components/system/ContentAll';
import ContentLeave from '@/components/system/ContentLeave';
import ContentRole from '@/components/system/ContentRole';

import { getUserList, getUserListDeleted } from '@/api/System/user';
import { getUserByAuthority } from '@/api/System/user';
// , getDept_users
import { getDeptList } from '@/api/System/dept';
import { getAuthorityList, add } from '@/api/System/authority';

export default {
  name: 'Organization',
  inject: ['reload'],
  components: {
    ContentAll,
    ContentLeave,
    ContentRole
  },
  data () {
    return {
      // 组件显示
      isloading: true,
      width: '',
      // 角色id 与 标题
      authoritymsg: {
        titles: '',
        id: null
      },
      // 选中的是成员还是部门
      checkMorD: true,
      active: 1,
      // 控制 组织架构 权限管理页面 的显示
      isshow: 0,
      // 控制 部门 与 角色 页面 的显示
      isContent: 0,
      //
      isDeptFrom: 0,
      // 创建角色内是否展示数据权限
      isRolebase: false,
      // 角色集
      authorityList: [
      ],
      // 角色内成员
      memberList: [],
      // 所有成员
      memberlistAll: [],
      // 离职成员
      memberlistleave: [],
      tablelist: [],
      // 部门集合
      deptlist: [
      ],
      // 角色添加弹出框
      dialogFormVisible: false,
      // 部门添加弹出框
      DepartmentEditBox: false,
      authorityForm: {
        authorityId: '',
        authorityName: '',
        dataScope: '',
        deptId: [],
        level: null
      },
      formLabelWidth: '120px',
      deptId: null,
      // 高亮显示开关
      showTree: true,
      // 测试数据
      data: { 'page': 1, 'pageSize': 10 },
      // el-tree-selection 插件
      values: '',
      selectParams: {
        multiple: false, // 是否多选
        clearable: true,
        placeholder: '请输入内容'
      },
      treeParams: {
        clickParent: true,
        filterable: true,
        'check-strictly': true, // 父子不相互关联
        'default-expand-all': true, // 是否展开
        'expand-on-click-node': false, // 是否在点击节点的时候展开或者收缩节点
        data: [],
        // 配置项
        props: {
          label: 'deptName', // 指定节点标签为节点对象的某个属性值
          value: 'ID'
        }
      }
    };
  },
  created() {
    this.isloading = true;
    getUserList(this.data).then((res) => {
      this.memberlistAll = res.data.list;
      // console.table(this.memberlistAll);
      this.isloading = false;
    });
    getDeptList(this.data).then(res => {
      this.deptlist = res.data.list;
      console.log(this.deptlist);
      this.treeParams.data = res.data.list;
    });
    this.width = window.innerWidth;
  },
  methods: {
    text() {

    },
    // 获取当前部门
    handleNodeClick (data, node, item) {
      // console.log(data);
      // this.loading = true;
      this.checkMorD = false;
      // console.log(this.checkMorD);
      // 取消成员的选中状态
      this.isContent = 3;
      // 打开高亮状态
      this.showTree = true;
      // console.log(data);
      this.deptId = data.ID;
      console.log(this.deptId + ' ' + data.ID);
      console.log(this.deptId === data.ID);
    },
    changejob () {
      this.isshow = 0;
    },
    changerole () {
      console.log('22');
      // 角色内占位成员
      this.memberList = [{ 'userName': '', 'deptID': '' }];
      this.isshow = 1;
      getAuthorityList(this.data).then(res => {
        this.authorityList = res.data.list;
        // 获取角色标题与橘色id;
        this.authoritymsg.title = res.data.list[0].authorityName;
        this.authoritymsg.id = res.data.list[0].authorityId;
        // 默认获取第一组数组
        const data = { 'id': null };
        data.id = res.data.list[0].authorityId;
        getUserByAuthority(data).then(res => {
          this.memberList = res.data.users;
        });
      });
    },
    // 全部成员获取
    change_job_all () {
      // 当前选中为成员
      this.checkMorD = true;
      this.isloading = true;
      this.isContent = 0;
      // 部门 索引清除
      this.deptId = null;
      getUserList(this.data).then((res) => {
        // this.$nextTick(res=>)
        this.memberlistAll = res.data.list;
        console.table(this.memberlistAll);
        this.isloading = false;
      });
      // 取消高亮
      this.showTree = false;
    },
    // 离职人员获取 有状态属性的话使用筛选
    change_job_leave () {
      this.isloading = true;
      this.isContent = 1;
      // 部门 索引清除
      this.deptId = null;
      // 取消高亮
      this.showTree = false;
      const data = {
        'page': 1,
        'pageSize': 1000
      };
      getUserListDeleted(data).then(res => {
        console.log(res);
        this.memberlistAll = res.data.list;
        console.table(this.memberlistAll);
        // 组件创建
        this.isloading = false;
      });
    },
    show_options () {
    },
    // 下拉菜单事件
    handleCommand (a, b) {

    },
    showaddrole() {
      console.log('添加角色');
    },
    hande (click) {
    },
    // 部门方法
    adddept (data) {
      this.DepartmentEditBox = true;
    },
    remove (node, data) {
      console.log(node);
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 添加角色
    addrole () {
      this.dialogFormVisible = true;
    },
    amendrole () {
    },
    // 设置为选中状态
    change_item(item) {
      // console.log(item);
      this.active = item.authorityId;
      this.authoritymsg.id = item.authorityId;
      this.authoritymsg.title = item.authorityName;
      const data = { 'id': null };
      data.id = item.authorityId;
      getUserByAuthority(data).then(res => {
        console.log(res);
        this.memberList = res.data.users;
      });
    },
    // 提交表单
    // 计数器
    handleChange() {},
    handdataScope(val) {
      if (val === '自定义') {
        this.isRolebase = true;
      } else {
        this.isRolebase = false;
      }
      console.log(val);
    },
    // 树过滤
    _searchFun(value) {
      this.$refs.treeSelect.filterFun(value);
    },
    // 自定义render
    renderFun(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      );
    },
    _nodeClickFun(val) {
    },
    Submitfrom(val) {
      console.log(val);
      add(val).then(res => {
        console.log(res);
        this.reload();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
@font-face {
  font-family: 'iconfont';  /* Project id 3288768 */
  src: url('//at.alicdn.com/t/font_3288768_sbqbr5ow0ko.woff2?t=1648711738587') format('woff2'),
       url('//at.alicdn.com/t/font_3288768_sbqbr5ow0ko.woff?t=1648711738587') format('woff'),
       url('//at.alicdn.com/t/font_3288768_sbqbr5ow0ko.ttf?t=1648711738587') format('truetype');
}
.iconfont{
    font-family:"iconfont" !important;
    color: $address_btn_color;
    font-size:14px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    margin-right: 10px;
    }
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.organization {
  font-size: 16px;
  width: 100%;
  min-width: 1280px;
  max-width: 1600px;
  /* 高度塌陷 */
  height: 715px;
  margin: 0 auto;
}
.contacts-layout-main {

  display: flex;
  height: 715px;
}
.layout-menu {
  top: 0;
  bottom: 0;
  flex: none;
  width: 250px;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 40px;
  background: #fafcfe;
  .menu-header{
    margin: 9px auto;
    width: 220px;
    line-height: 32px;
    height: 32px;
    display: flex;
    .menu-header-left{
      border: 1px solid #d9d9d9;
      border-width: 1px 0px 1px 1px;
       border-radius: 3px 0 0 3px;
    }
    .menu-header-right{
      border: 1px solid #d9d9d9;
      border-width: 1px 1px 1px 0px;
       border-radius: 0 3px 3px 0px;
    }
    div{
      font-size: 14px;
      padding: 0 8px;
      width: 50%;
      line-height: 32px;
    }
  }
}
.menu-content {
  line-height: 40px;
  div{
    display: flex;
    flex-direction: column;
  }
}
// 子菜单(页面复用)
.job-outline {
  display: flex;
  justify-content: space-between;
  text-align: left;
  height: 28px;
  padding-left: 15px;
  font-size: 14px;
  line-height: 28px;
  color: #91a1b7;
  border-bottom: 1px solid rgb(248, 246, 246);
}
.job-outline-add {
  text-align: center;
  line-height: 23px;
  color: $address_btn_color;
  font-weight: 300;
  font-size: 24px;
  width: 14px;
  height: 28px;
  margin-right: 10px;
  cursor: pointer;
}
.fx-organization-content {
  text-align: left;
  max-width: none;
  height: 40px;
  font-size: 14px;
}
.job-content {
  position: relative;
}
.job-list {
  height: 100%;
  div{
    height: 34px;
    font-size: 14px;
    display: flex;
    align-items: center;
    line-height: 34px;
    border-left: 3px solid transparent;
    &:hover {
      background-color: $address_option_color;
      .job-list-item-right{
          display: block;
          cursor: pointer;
      }
    }
    .job-list-item-menu{
      width: 55px;
      margin-left: 20px;
    }
  }
  .item_Active{
    background-color: $address_option_color;
    border-left: 3px solid $address_btn_color;
  }
   .job-list-item-left{
        margin-left: 35px;
        white-space: nowrap;//不换行
        text-overflow: ellipsis;//将文本溢出显示为（…）
        overflow: hidden;//溢出隐藏。
        span{
          margin-left:10px;
        }
      }
    .job-list-item-right {
      display: none;
      margin-right: 15px;
}
}
.tab-content-inner {
  display: block;
  position: absolute;
  left: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
//tree
/**每个子节点的公共属性 */
.custom-tree-node {
  width: 100px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
::v-deep .el-tree-node__content {
  height: 34px;

}
// /*节点失焦时的背景颜色*/
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color:  $address_option_color !important;
  color: rgb(0, 0, 0) !important;
}
//动态属性
.icon-menu {
  display: none;
}
/**下拉菜单 */
.el-dropdown-link {
  cursor: pointer;
  color: $address_btn_color;
}

::v-deep .el-tree-node__content:hover {
  color: #333333;
  background-color: $address_option_color;
}
::v-deep .el-tree-node__content:hover .showmenu {
  display: block !important;
}
.showmenu{
  display:none;
  margin-left: 6px;
  font-size:15px;
}

//right
.layout-content {
  height: 715px;
  width:1350px;
  background: rgb(255, 255, 255);
  position: relative;
}
.invite-banner {
  position: relative;
  display: flex;
  align-items: center;
  height: 104px;
  margin: 10px 20px 0;
  background-image: url(https://g.jdycdn.com/app/pc/aa0376b9f918.png);
  background-size: cover;
  border-radius: 2px;
}
.member-btn-pane {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  margin: 0 20px;
}
.layout-content .organization-content-right .depart-info .depart-name {
  flex: auto;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* todo 动态属性 */
.j_r_active {
  border-left: 1px solid $address_btn_color;
  background-color: $address_btn_color;
  color: #ffffff;
  border-color: $address_btn_color;
}
.content_active {
  border-left: 2px solid $address_btn_color;
  background-color: #e7f7f6;
}
.manager-group-name {
  color: black;
  height: 50px;
  padding: 0px 20px 0;
  font-weight: 600;
  line-height: 58px;
  border-bottom: 1px solid #eeecec;
  text-align: left;
  font-size: 14px;
}
::v-deep .el-dialog{
  .el-dialog__header{
    border-bottom:1px solid #e9e9e9;
    text-align: left;
    .el-dialog__title{
      font-weight: 700;
      font-size:16px;
    }
  }
  .el-dialog__body{
    // border-bottom:1px solid #e9e9e9;
    padding: 10px 20px;
    .el-form{
      .el-form-item{
        label{
          text-align: left;
        }
      }
      .el-input{
        .el-input__inner{
          height:30px;
        }
      }
    }
  }
  .dialog-footer{
    .el-button{
      font-size: 12px;
    }
    .el-button--default{
      &:hover{
        background-color: rgb(233, 233, 233);
        color: black;
      }
    }
    .el-button--primary{
      background-color: $address_btn_color;
    }
  }
}
  .showfunc{
    display: block !important;
  }
  ::v-deep .createauthority{
    .el-dialog__wrapper{
      .el-dialog{
        .el-dialog__body{
          .el-form{
            .el-form-item{
              display:flex;
              .el-form-item__label{
                text-align: left;
                flex: none;
                width: 80px;
                &::before{
                  content: "*";
                  color: red;
                }
              }
              .el-form-item__content{
                flex: 1;
                .el-select,.el-input-number{
                  width: 100%;
                  .el-input{
                    .el-input__inner{
                      text-align:left;
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
</style>
