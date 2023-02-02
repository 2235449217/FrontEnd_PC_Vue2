<template>
  <div class="container">
    <div class="Content">
      <div class="wrapper-title">
        <div>全部成员</div>
        <div class="depart-operate">
          <el-switch
            v-model="isswitch"
            active-color="#13ce66"
            inactive-color="#bfbfbf"
          />
          <div>允许成员修改姓名</div>

        </div>
      </div>
      <div class="member-btn-pane">
        <div class="btn-group">
          <button class="x-button" @click="AddMember">邀请成员</button>
          <button class="x-button" @click="ChangeMember">调整部门</button>
          <button class="x-button" @click="DeleteMembers">转为离职</button>
        </div>
        <div class="x-search-input">
          <div class="input-wrapper">
            <div class="input-content">
              <div class="input-prefix">
                <el-input
                  v-model="textvalue"
                  type="text"
                  prefix-icon="el-icon-search"
                  placeholder="搜索成员"
                  @input="changeInput"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="group-config">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="Allmember"
          tooltip-effect="dark"
          :sortable="false"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @cell-click="handleClick"
        >
          <el-table-column type="selection" width="80px" />
          <el-table-column prop="userName" label="姓名">
            <span slot-scope="scope">
              <div class="headImg">
                <img :src="'https://www.cppwnn.top/api/'+scope.row.headerImg" alt="">
                {{ scope.row.userName }}
              </div>
            </span>
          </el-table-column>
          <el-table-column prop="phone" label="手机" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="角色">
            <span slot-scope="scope">
              <div v-for="(item,index) in scope.row.authorities" :key="index" class="show_role">
                <i class="iconfont_gray" styles="Blue">&#xe606;</i>
                <span>{{ item.authorityName }}</span>
              </div>
            </span>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column
            label="全部"
            width="100"
            :filters="[{ text: '已入职', value: true }, { text: '邀请中', value: false }]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          />
        </el-table>

      </div>

      <el-drawer
        ref="drawer"
        title="我嵌套了 Form !"
        :before-close="handleClose"
        :with-header="false"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="344px"
      >
        <div>
          <div class="fx-member-info-panel">
            <div class="info-header">
              <div class="left-info">
                <img class="avatar-wrapper" :src="'https://www.cppwnn.top/api/'+form.headerImg">
                <div class="team-info">
                  <div class="member-nickname">{{ form.userName }}</div>
                  <div class="invite-status">已加入</div>
                </div>
              </div>
              <i class="close-icon iconfont" @click="close">&#xe60a;</i>
            </div>
          </div>
        </div>
        <div class="demo-drawer__content">
          <el-form :model="form">
            <el-form-item label="姓名">
              <el-input v-model="form.userName" autocomplete="off" :disabled="true" />
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="form.nickName" autocomplete="off" />
            </el-form-item>
            <span>不支持修改此编号</span>
            <el-form-item label="手机">
              <el-input v-model="form.phone" autocomplete="off" :disabled="true">
                <template slot="prepend">+86 &nbsp;&nbsp;
                  <i class="iconfont_gray">&#xe60b;</i>
                </template>
              </el-input>
            </el-form-item>
            <span>手机已验证,您无法修改.如需修改请联系成员在个人设置页面重新绑定</span>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" autocomplete="off" :disabled="true" />
            </el-form-item>
            <el-form-item label="部门">
              <!-- <span>{{ form.dept.deptName }}</span> -->
              <el-tree-select
                ref="treeSelect"
                v-model="form.deptId"
                :select-params="selectParams"
                :filter-node-method="filterNodeMethod"
                :tree-params="treeParams"
                :tree-render-fun="renderFun"
                @searchFun="_searchFun"
                @node-click="_nodeClickFun"
              />
            </el-form-item>
            <el-form-item label="角色">
              <ul v-if="!rolesnum" class="x-member-value-pane" @click="Selectrole">
                <li v-for="(item,index) in form.authorities" :key="index" class="select-item">
                  <i class="iconfont-role">&#xe606;</i>
                  <span>{{ item.authorityName }}</span>
                </li>
              </ul>
              <ul v-if="rolesnum" class="x-member-value-pane" @click="Selectrole">
                <div class="checked_dept">
                  + 点击选择角色
                </div>
              </ul>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button type="primary" size="small" @click="closeDrawer()">修改</el-button>
            <el-button size="small" @click="Deletehint">转为离职</el-button>
          </div>
        </div>
      </el-drawer>
      <!-- 邀请成员表单 -->
      <el-dialog title="邀请成员" :visible.sync="dialogFormVisible" width="600px">
        <div class="content-wrapper">
          <ul class="tab-header-wrapper">
            <li v-for="(item,index) in addrolelist" :key="index" class="tab-header-item" :class="{tab_header_active:nums===index}" @click="changelistId(index)">
              <div class="tab-header-content">{{ item }}</div>
            </li>
          </ul>
          <invite-manual
            v-if="nums===0"
            :show.sync="show"
            :selectrolelist="selectrolelist"
            :titles.sync="titles"
            :dialog-form-visible.sync="dialogFormVisible"
            @changetitles="changetitles"
            @changeroleInfo="changeroleInfo"
            @isDeptFrom="isDeptFrom"
          >11</invite-manual>
          <invite-batch v-if="nums===1">11</invite-batch>
        </div>
      </el-dialog>
      <el-dialog title="部门列表" :visible.sync="dialogVisible" width="600px">
        <div class="popover">
          <ul class="popover_top">
            <span class="popover_top_item">{{ currentDepartment.name }}</span>
          </ul>

          <div class="popover_center">
            <div class="popover_center_header">
              <div class="tab-control">
                <div class="active_item tab-control-item">
                  组织架构
                </div>
              </div>
              <div class="popover_input" :class="{maxInput:maxInput===true}">
                <div class="fow-search-input">
                  <i class="iconfont icon-wf-sousuo" />
                  <input v-model="filterText" type="text" placeholder="搜索" @focus="getfocus" @blur="leavefocus">
                  <i v-if="maxInput===true" class="iconfont icon-wf-a-guanbi1" />
                </div>
              </div>
            </div>
            <div class="popover_center_content">
              <div class="department-tree">
                <el-tree
                  ref="tree"
                  :data="deptlist"
                  :props="{ label:'deptName',id:'ID' }"
                  show-checkbox
                  node-key="ID"
                  current-node-key
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  show-checkpopover
                  :check-on-click-node="true"
                  :check-strictly="true"
                  default-expand-all
                  :expand-on-click-node="false"
                  @check="changetree"
                  @check-change="StructureCheck"
                >
                  <span slot-scope="{ node}" class="custom-tree-node">
                    <i class="iconfont">&#xe604;</i>
                    {{ node.label }}
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
          <div class="popover_bottom">
            <div class="popover_bottom_right">
              <el-button size="small" @click="dialogVisible=false">取消</el-button>
              <el-button size="small" @click="submitDepartment">确定</el-button>
            </div>
          </div>

        </div>

      </el-dialog>
      <Process
        v-if="show"
        :show.sync="show"
        :titles="titles"
        :deptlist="deptlist"
        :authoritylist="authoritylist"
        :appinfo="appinfo"
        :allmember="Allmember"
        @changeAppInfo="changeAppInfo"
        @confirmSend="confirmSend"
      />

    </div>
    <el-pagination
      layout=" total,prev, pager, next"
      :total="total"
      @current-change="changePage"
    />
  </div>

</template>

<script>
import InviteManual from './invite/InviteManual';
import InviteBatch from './invite/InviteBatch';
import Process from '@/components/common/Process';
import { getAuthorityList } from '@/api/System/authority';
import { del, getUserList, changeuser, getUserListOrder } from '@/api/System/user';
import { getDept_users } from '@/api/System/dept';
import { deepCopy } from '@/utils/deepCopy';
export default {
  inject: ['reload'],
  components: {
    InviteManual,
    InviteBatch,
    Process
  },
  props: {
    deptlist: {
      type: Array,
      default() {
        return [];
      }
    },
    checkMorD: {
      type: Boolean,
      default() {
        return true;
      }
    },
    deptId: {
      type: Number,
      default() {
        return null;
      }
    }
  },
  data () {
    return {
      // 右侧搜索框绑定的值
      textvalue: '',
      // 当前部门(用于调整部门)
      currentDepartment: { name: '', ID: null },
      // 部门搜索
      filterText: '',
      maxInput: false,
      dialogVisible: false,
      Allmember: [],
      istrue: 3,
      // Process组件参数
      show: false,
      titles: ['组织架构', '角色', '成员'],
      authoritylist: [],
      // app携带信息 负责传进去
      appinfo: {
        'dept': [],
        'role': [],
        'memeber': []
      },
      data: {
        'page': 1,
        'pageSize': 10
      },
      // 选中角色集合
      selectrolelist: [],
      height: '',
      form: {},
      // 单挑数据存放
      row: {},
      dialog: false,
      loading: false,
      timer: null,
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogRoleVisible: false,
      addrolelist: ['手动邀请成员', '批量导入成员'],
      nums: 0,
      formLabelWidth: '100px',
      // 表格选中列
      checkLine: [],
      // 预选中的部门列表 用于添加成员 与 调整部门时使用
      checkDeptlist: [],
      // 确定后 调整的部门列表
      confrim: [],
      // 滑块
      isswitch: false,
      imput: '',
      // 分页模块
      pages: 0,
      total: null,
      current: '',
      size: 0,
      map: new Map(),
      // el-tree-selection 插件
      values: '',
      // value: null,
      selectParams: {
        multiple: false, // 是否多选
        clearable: true,
        placeholder: '请输入内容'
      },
      // 搜索过滤方法
      filterNodeMethod(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
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
      },
      text: ''
    };
  },
  computed: {
    // 当前用户角色数量
    rolesnum() {
      if (this.dialog) {
        return this.form.authorities.length === 0;
      }
      return false;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    deptId() {
      if (this.deptId !== null) {
        this.changedept();
      }
    }
  },
  created() {
    // console.log('组件创建');
    // console.log(this.checkMorD);
    this.loading = true;
    const data = { 'page': 1, 'pageSize': 10 };
    // 获取全部成员
    if (this.checkMorD) {
      getUserList(data).then((res) => {
        console.log(res);
        this.total = res.data.total;
        this.Allmember = res.data.list;
        this.loading = false;
      });
    } else {
      const msg = {
        'id': null
      };
      msg.id = this.deptId;
      // 根据部门id获取部门下成员
      getDept_users(msg).then(res => {
        console.log(res.data);
        this.Allmember = res.data;
        this.loading = false;
      });
      // getDept_users(this.deptId)
      // this.Allmember = [];
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.width = window.innerWidth;
    });
    getAuthorityList(this.data).then(res => {
      this.authoritylist = res.data.list;
    });
  },
  methods: {
    changedept() {
      this.loading = true;
      const msg = {
        'id': null
      };
      msg.id = this.deptId;
      // console.log(data.id);
      // 根据部门id获取部门下成员
      getDept_users(msg).then(res => {
        console.log(res);
        this.Allmember = res.data;
        // this.total =res.data
        this.loading = false;
      });
    },
    changeInput() {
      const data = { 'page': 1, 'pageSize': 10, 'searchQuery': '' };
      data.searchQuery = this.textvalue;
      // 获取全部数据
      getUserListOrder(data).then(res => {
        this.total = res.data.total;
        this.Allmember = res.data.list;
      });
    },
    // 调整部门
    submitDepartment() {

    },
    // 筛选部门
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    changetitles(value) {
      this.titles = value;
    },
    tip() {
      this.$message({
        message: '邀请成功',
        type: 'warning'
      });
    },
    handleSelectionChange(val) {
      this.checkLine = val;
    },
    handleClick(row) {
      const data = deepCopy(row);
      this.form = data;
      this.form.authorityIds = [];
      this.form['authorities'].forEach(res => {
        this.form.authorityIds.push(res.authorityId);
      });
      const filterarr = ['CreateBy', 'CreatedAt', 'UpdateBy', 'UpdatedAt', 'activeColor',
        'authority', 'authorityId', 'baseColor', 'dept', 'sideMode'];
      for (var key in (this.form)) {
        filterarr.find((item) => {
          if (key === item) {
            delete this.form[key];
          }
        });
      }
      this.dialog = true;
      this.treeParams.data = this.deptlist;
    },
    //  CRUD
    AddMember() {
      this.dialogFormVisible = true;
    },
    isDeptFrom() {
    },
    // 调整部门模态框提示
    ChangeMember() {
      if (this.checkLine.length === 0) {
        this.$message({
          message: '请选择需要调整的部门成员',
          type: 'warning'
        });
      } else {
        this.dialogVisible = true;
      }
    },
    changeAppInfo(val) {
      this.appinfo = val;
      this.form.authorityIds = this.appinfo['role'];
      // 选中角色数组清空
      this.selectrolelist = [];
      // 在此添加
      this.authoritylist.forEach(res => {
        val['role'].forEach(item => {
          if (res.authorityId === item) {
            this.selectrolelist.push(res);
          }
        });
      });
      this.form.authorities = this.selectrolelist;
    },
    // 改变父组件appinfo中的角色Id
    changeroleInfo(val) {
      this.appinfo['role'] = val;
    },
    // 调整部门方法
    // suremodify() {
    //   if (this.checkDeptlist.length === 0) {
    //     this.$message({
    //       message: '至少选择一个部门',
    //       type: 'warning'
    //     });
    //   } else {
    //     this.checkDeptlist.forEach(item => {
    //       this.confrim.push(item.label);
    //     });
    //     this.tablelist.forEach(item => {
    //       this.checkLine.forEach(res => {
    //         if (item === res) {
    //           item.dept = this.confrim;
    //         }
    //       });
    //     });
    //     this.dialogDeptVisible = false;
    //     this.$message({
    //       showClose: true,
    //       message: '调整成功',
    //       type: 'success'
    //     });
    //   }
    // },
    // 批量删除用户
    DeleteMembers() {
      const data = { 'ids': [] };
      // const data = [];
      if (this.checkLine.length === 0) {
        this.$message({
          message: '请选择需要调整的部门成员',
          type: 'warning'
        });
      } else {
        this.checkLine.forEach(res => {
          data['ids'].push(res.ID);
        });
        del(data).then((res) => {
          this.$message('删除成功');
          this.reload();
        });
      }
    },
    Deletehint() {
      this.$confirm('您确定将所选成员转为离职成员?<p style="font-size:12px;color:gray">转为离职成员后，使用相同成员编号再次加入时，可恢复相关配置（邀请中的成员将直接删除）</p>', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {};
        data.id = this.form.ID;
        del(data).then((res) => {
          this.reload();
        });
        this.dialog = false;
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 抽屉内修改
    closeDrawer() {
      const data = deepCopy(this.form);
      delete data['authorities'];
      delete data['nickName'];
      // 调用修改用户信息接口
      changeuser(data).then(res => {
        this.reload();
      });
    },
    // 抽屉操作
    handleClose(done) {
      done();
    },
    close() {
      this.dialog = false;
    },
    changelistId(index) {
      this.nums = index;
    },
    // 传入Process组件的值
    Selectrole() {
      this.show = true;
      this.titles = ['角色'];
      this.appinfo['role'] = this.form.authorityIds;
    },
    // 过滤器
    filterTag(value, row) {
      return row.type === value;
    },
    // 页面跳转
    changePage(val) {
      this.loading = true;
      const data = { 'page': val, 'pageSize': 10 };
      if (this.textvalue === '') {
        getUserList(data).then((res) => {
          this.Allmember = res.data.list;
          this.loading = false;
        });
      } else {
        console.log('11');
        data.searchQuery = this.textvalue;
        getUserListOrder(data).then((res) => {
          this.Allmember = res.data.list;
          console.log(res.data);
          this.loading = false;
        });
      }
    },
    /** 页面数量 */
    handleSizeChange(num) {
    },
    confirmSend(value) {
      console.log(value);
    },
    // 树过滤
    _searchFun(value) {
      this.$refs.treeSelect.filterFun(value);
    },
    // 自定义render
    renderFun(h, { node, data, store }) {
      // console.log(data, store);

      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      );
    },
    _nodeClickFun(a, b, c, d) {
      console.log(a);
    },
    StructureCheck(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.ID]);
        this.currentDepartment.name = data.deptName;
        this.currentDepartment.ID = data.ID;
        console.log(this.currentDepartment);
      }
    },
    changetree(data, lst) {
      if (lst.checkedKeys.length === 0) {
        // 这里的treeForm是你el-tree命名的ref的值
        this.$refs.tree.setCheckedKeys([data.ID]);
      }
    },
    getfocus() {

    },
    leavefocus() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
@import '@/styles/mixin.scss';
@font-face {
  font-family: 'iconfont';  /* Project id 3288768 */
  src: url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff2?t=1649420958600') format('woff2'),
       url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff?t=1649420958600') format('woff'),
       url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.ttf?t=1649420958600') format('truetype');
}
.iconfont {
  font-family:"iconfont" !important;
  color: $address_btn_color;
  font-size:14px;font-style:normal;
  margin-right: 10px;
}
.iconfont_gray {
  font-family:"iconfont" !important;
  font-size:14px;font-style:normal;
  margin-right: 10px;
}
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
//设置单行颜色
::v-deep .el-table__header-wrapper table thead tr{
  border-bottom: 1px solid #e9e9e9;
  height: 42px;
  background-color: #f4f4f4;
  color: #1f2d3d;
}
//设置多行颜色
::v-deep .el-table tr {
  text-align:left;
  height: 45px;
}
::v-deep .el-table__body-wrapper {
  margin-top: 5px;
  // height: 40px;
  display: flex;
  align-items: center;
}

::v-deep .el-table__row{
  &:hover{
    background-color:$address_option_color;
  }
  td{
    &:nth-child(5){
      // background-color:red;
      max-width: 140px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
::v-deep .is-leaf {
  &:nth-child(3) .cell,&:nth-child(4) .cell {
    &:after{
      @include iconfont;
        font-size: 13px;
        content:"     \e605";
        color: $address_btn_color;
  }
  }

}
// .m_t_p{
//   height: 40px;
//   background-color:rgb(255, 241, 241);
//   font-size:12px;
//   line-height:40px;
//    span:nth-child(1){
//    color: red;
//   }
//   span:nth-child(2){
//     cursor: pointer;
//     margin-left:10px;
//     color: $address_btn_color;
//   }
// }
.show_role{
  display: inline-flex;
  max-width: 100%;
  margin-right: 5px;
  padding: 0 8px;
  line-height: 25px;
  background: #f3f6fc;
  border-radius: 2px;
  i{
    color:#248af9;
    font-weight: 800;
  }
  span{
    font-size:12px;
  }
}
.headImg{
  display: inline-flex;
  align-items: center;
  img{
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background-color:red;
    margin-right:15px;
  }
}
.invite_type{
    z-index: 99;
  .el-button{

    padding: 5px 10px;
    height:24px;
    width: 82px;
    font-size:12px;
    border-color:$address_btn_color;
    color: $address_btn_color;
    &:hover{
     background-color: rgb(236, 245, 255);
    }
    span{
      line-height:24px;
    }
  }

}
 ::v-deep .el-switch__core{
   width: 28px !important;
   height: 16px;
   &::after{
     top: 1px;
     left: 0;
     width: 12px;
     height: 12px;
   }
  }
::v-deep.el-switch.is-checked .el-switch__core::after {
    left: 100%;
    margin-left: -13px;
}
.Content{
  .wrapper-title{
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size:14px;
    text-align: left;
    line-height: 50px;
    border-bottom: 1px solid #e9e9e9;
    div:nth-child(1){
      font-weight: bold;
    }
    .depart-operate{
      width: 145px;
      height: 18px;
      line-height:18px;
      display: flex;
      .el-switch{
        height: 18px;
        // .el-switch__core{
        //   height: 18px;
        // }
      }
      div{
        font-size:12px;
        margin-left: 8px;
        line-height:18px;

      }
    }
  }
  .member-btn-pane{
    height: 48px;
    margin: 0 20px;
    display:flex;
    align-items: center;
    justify-content:space-between;
    .btn-group{
      .x-button{
        color: #1f2d3d;
        background: #fff;
        height: 32px;
        padding: 0 20px;
        line-height: 30px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        outline: none;
        cursor: pointer;
        &:hover{
          background-color:rgb(233,233,233);
          transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
        }
      }
      .x-button:nth-child(1){
          border: 1px solid $address_btn_color;
         background:$address_btn_color;
         color: #fff;
        &:hover{
          background-color:rgb(86, 202, 193);
          border: 1px solid rgb(86, 202, 193);
          transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
        }
      }
    }
    //按钮样式设置
    .x-search-input {
      width: 180px;
      .input-wrapper{
        height: 26px;
        position: relative;
        flex: auto;
        .input-content{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          .input-prefix{
            font-size: 16px;
            color: #5e6d82;
            display: flex;
            align-items: center;
            .x-iconfont{
              &:before{
                content: "\e609";
                color: #5e6d82;
              }
              display:inline-block;
              position:absolute;
              left: 10px;
            }
            .el-input{
            //  font-size: 14px;
            // padding: 6px 0 6px 35px;
            // line-height: 1;
            // background: #f4f4f4;
            // border: none;
            // border-radius: 18px;
            // outline: none;
            // white-space: nowrap;
              &:focus{border-color:#37e76c}
            // text-overflow: ellipsis;
            }
          }
          // input{
          //   font-size: 14px;
          //   padding: 6px 0 6px 35px;
          //   line-height: 1;
          //   background: #f4f4f4;
          //   border: none;

          //   outline: none;
          //   white-space: nowrap;
          //   text-overflow: ellipsis;
          // }
        }
      }

    }
  }
  .group-config {
  margin: 0 20px;

  .el-table{
    font-size:13px;
  }
    .header_box {
    height: 32px;
  }
}
}
//抽屉样式
.fx-member-info-panel{
  border-bottom: 1px solid #e9e9e9;
  .info-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 20px;
    border: 1px solid #e9e9e9;
    // background-color:red;
    .left-info{

      display: flex;
      align-items: center;
      .avatar-wrapper{
        border-radius: 30px;
        position: relative;
        background-color:pink;
        width: 50px;
        height: 50px;
        line-height: 50px;
      }
      .team-info{
        width: 192px;
        margin-left: 20px;
        text-align: left;
        .member-nickname{

          font-weight: 500;
          font-size: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .invite-status{
          color: #fff;
          background-color: #108ee9;
          display: inline-block;
          height: 22px;
          margin-top: 5px;
          padding: 0 6px;
          font-size: 12px;
          line-height: 22px;
          border-radius: 11px;
        }
      }
    }
    .close-icon{
      color: #91a1b7;
      font-size: 24px;
      margin-left: 5px;
      cursor: pointer;
      transition: color .2s ease;
    }
  }
}
::v-deep .demo-drawer__content{
  padding:0px 20px 15px;
  .el-form{
    .el-form-item{
      margin-bottom: 0px;
      .el-form-item__content{
        line-height:0px;
        .el-input-group{
          .el-input-group__prepend{
            padding:0px 5px 0px 10px;
          }
        }
        .x-member-value-pane{
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          align-items: flex-start;
          height: 80px;
          width: 295px;
          padding:0;
          overflow-x: hidden;
          overflow-y: auto;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          .checked_dept{
            width: 143px;
            height: 32px;
            line-height: 32px;
            color: $address_btn_color;
            margin: 25px auto;

      }
          .select-item{
            // width: 40px;
            // height: 20px;
            display: flex;
            align-items: center;
            margin: 5px 0 0 5px;
            padding: 5px 10px;
            background: #f3f6fc;
            border-radius: 1px;
            .iconfont{
             color: #fa0;
             margin-right: 4px;
             display: inline-block;
             vertical-align: middle;
           }
            .iconfont-role{
              @include iconfont;
               display: inline-block;
               margin-right: 4px;
               color: #248af9;
           }
           span{
              display:inline-block;
              line-height: 20px;
              vertical-align: middle;
              word-wrap: break-word;
              word-break: break-all;
           }
          }
        }
      }

    }
    .el-form-item:nth-child(1) .el-form-item__label,.el-form-item:nth-child(2) .el-form-item__label{
        &:after{
          content: "*";
          color: #e64340;
        }
    }
    span{
      display: block;
      text-align: left;
      font-size:12px;
      margin: 5px 0px 0px;
      color: #91a1b7;
    }
  }

}
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
// ::v-deep .el-input{
//   width: 295px;
//   height: 32px;
//   .el-input__inner{
//       height: 32px;
//       padding: 0 10px;
//   }
// }
//三个按钮
::v-deep .demo-drawer__footer{
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9e9e9;
    .el-button{
      float: left;
    }
    .el-button:nth-child(1){
      background-color:$address_btn_color;
      border: 1px solid $address_btn_color;
      &:hover{
        background-color:#56cac1;
        transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
        border: 1px solid #56cac1;
        color: rgb(255, 255, 255);
      }
    }
    .el-button:nth-child(2){
      &:hover{
        background-color:#e9e9e9;
        transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
        border: 1px solid #e9e9e9;
        color: black;
      }
    }
    .el-button:nth-child(3){
      color: #e64340;
      border: 1px solid #e64340;
      &:hover{
        background-color:#e64340;
        transition: box-shadow .3s ease,background .3s ease,border-color .3s ease,color .3s ease,-webkit-box-shadow .3s ease;
        border: 1px solid #e64340;
        color: rgb(255, 255, 255);
      }
    }

}
// 模态框
::v-deep .el-dialog__wrapper {
 .el-dialog {
    .el-dialog__body{
      .content-wrapper{
            position: relative;
            display: flex;
            flex-direction: column;
            width: 520px;
            margin: auto;
            background: #fff;
            border-radius: 4px;
            .tab-header-wrapper{
              display: flex;
              padding: 0px;
              justify-content:space-around;
              margin: 0px;
              border-bottom: 1px solid #e9e9e9;
              .tab-header-item{
                width: 173px;
                list-style: none;
                height: 49px;
                text-align: center;
                line-height:49px;
                border-bottom: 3px solid #ffffff;
                 &:hover{
                  color: $address_btn_color;
                  transition: color .2s;
                  cursor: pointer;
                }
              }
              .tab_header_active{
                color: $address_btn_color;
                border-bottom: 3px solid $address_btn_color;

              }
            }
       }
    }
}
}
.dept-tab{
  height: 514px;
  padding: 0 auto;
  .dept-tab-top{
    margin-top: 0;
    padding-left: 0;
    width: 610px;
    height: 80px;
    display:flex;
    //拆行
    flex-wrap:wrap;
    //对其
    align-content: flex-start;
    align-items: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    .dept-tab-item{
      display: inline-block;
      margin: 5px 0 0 5px;
      padding: 5px 10px;
      background: #f3f6fc;
      border-radius: 1px;
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
   .dept-tab-bottom{
     border: 1px solid #d9d9d9;
     width: 610px;
     height: 380px;
     .dept-bottom-header{
       width:100%;
       height: 39px;
       border-bottom: 1px solid #d9d9d9;
       display: flex;
       justify-content: space-between;
       align-items: center;
       div:nth-child(1){
         margin-left: 15px;
         height: 37px;
         line-height: 40px;
         border-bottom:3px solid $address_btn_color;
       }
       div:nth-child(2){
         margin-right: 15px;
         height: 25px;
         width: 150px;
         line-height: 25px;
         background: #f4f4f4;
         border-radius: 18px;

         input{
           width: 100px;
           border: none;
           white-space: nowrap;
           text-overflow: ellipsis;
           background: #f4f4f4;
           outline: none;
         }
         i{
           margin-right: 0px;
         }
       }
     }

  }
  .dept-tab-footer{
    padding-top:5px;
    text-align: right;
    .el-button:nth-child(1){
      &:hover{
        color:black;
        background: #e9e9e9;
        border:1px solid  #e9e9e9;
      }
    }
    .el-button:nth-child(2){
      border: $address_btn_color;
      background: $address_btn_color;
      color:#ffffff;
      &:hover{
        background-color:#56cac1;
      }
    }
  }

}
.el-message-box__wrapper ::v-deep .el-message-box{
  width: 500px !important;
  height: 199px;
}
::v-deep  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: $address_btn_color;
    border-color: $address_btn_color;
}
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: $address_btn_color;
    border-color: $address_btn_color;
}
// 分页样式
.el-pagination{
  position: absolute;
  bottom: 15px;
  right:0;
}
::v-deep .el-table .cell{
  white-space: nowrap;
}
::v-deep .el-input__suffix{
  margin: 0px !important;
  display: flex !important;
  align-items: center;
}
  .popover{
  height: 514px;
  padding: 0 auto;
  .popover_top{
    margin-top: 0;
    padding-left: 0;
    // width: 610px;
    height: 80px;
    display:flex;
    //拆行
    flex-wrap:wrap;
    //对其
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
    //  width: 610px;
     height: 380px;
     .popover_center_header{
       .tab-control{
        display: flex;
        .tab-control-item{
          // flex: 1; 子元素宽度相同
          text-align: center;
          cursor: pointer;
          // width:60px;
          margin: 0 10px;
          padding: 0 5px;
          height:37px;
          line-height:37px;
          // background-color: red;
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
            //padding:5px 28px;
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
     .popover_bottom_right{
        button:nth-child(1){
          &:hover{
          background-color:  rgb(233, 233, 233);
          border-color:rgb(233, 233, 233) ;
          color: #1f2d3d;
          }
        }
         button:nth-child(2){
          //  color: #1f2d3d;
           background-color:$address_btn_color;
           color: white;
          &:hover{
          background-color: rgb( 86, 202, 193);

          }
        }
     }
  }

}
 ::v-deep .el-input--prefix .el-input__inner{
    height: 26px;
    background-color:#f4f4f4;
    border-radius: 16px;
    border: none;
}
::v-deep .el-input__prefix{
  top:-7px;
  color:#5e6d82;
}
::v-deep .el-tree-select{
  .el-select {
    display: block;
  }
}
</style>
