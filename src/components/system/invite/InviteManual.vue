<template>
  <div class="container">
    <ul class="tab-hint">
      <li>成员加入时无法更改您输入的内容，请输入正确的信息</li>
      <li>按输入的联系方式发送邀请；同时输入手机和邮箱，只发送手机邀请</li>
    </ul>
    <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="usename">
        <el-input v-model="ruleForm.username" autocomplete="off" placeholder="必填,最长80个字符" />
      </el-form-item>
      <el-form-item label="手机" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="ruleForm.phone" autocomplete="off" placeholder="手机跟邮箱必须填一项">
          <template slot="prepend">+86 &nbsp;&nbsp;
            <i class="iconfont_gray">&#xe60b;</i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="ruleForm.email" autocomplete="off" />
      </el-form-item>
      <!-- //角色为多个  部门为单个 -->
      <el-form-item label="部门" :label-width="formLabelWidth" prop="deptId">
        <el-tree-select
          ref="treeSelect"
          v-model="ruleForm.deptId"
          :select-params="selectParams"
          选择框设置
          :tree-params="treeParams"
          :tree-render-fun="renderFun"
          @searchFun="_searchFun"
          @node-click="_nodeClickFun"
        />

      </el-form-item>
      <el-form-item label="角色">
        <div class="form-group-list">
          <ul class="x-member-value-pane" @click="Selectrole">
            <div v-if="selectrolelist.length === 0" class="checked_dept">
              + 点击选择角色
            </div>
            <div v-if="selectrolelist.length!==0">
              <li v-for="(item,index) in selectrolelist " :key="index" class="select-item">
                <i class="iconfont">&#xe608;</i>
                <span>{{ item.authorityName }}</span>
              </li>
            </div>

          </ul>
        </div>
      </el-form-item>
    </el-form>

    <div class="footer">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
// import { add } from '@/api/System/user';

// 部门查询
import { getDeptList } from '@/api/System/dept';
import { getAuthorityList } from '@/api/System/authority';

// 用户注册账号
import { add } from '@/api/System/user';
export default {
  inject: ['reload'],
  props: {
    dialogDeptVisible: Boolean,
    dialogFormVisible: Boolean,
    checkDeptlist: {
      type: Array,
      default() {
        return [];
      }
    },
    // 选中角色信息数组
    selectrolelist: {
      type: Array,
      default() {
        return [];
      }
    },
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入成员姓名'));
      } else {
        callback();
      }
    };
    var checkSerial = (rule, value, callback) => {
      const p = /^[0-9A-Za-z]{6,18}$/;
      if (p.test(value)) {
        callback();
      } else {
        return callback(new Error('仅支持字母、数字、下划线'));
      }
    };
    var checkUsedPhone = (rule, value, callback) => {
      const p = /^1[0-9]{10}$/;
      if (p.test(value)) {
        callback();
      } else {
        return callback(new Error('手机格式不正确'));
      }
    };
    var checkEmail = (rule, value, callback) => {
      var rg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (rg.test(value)) {
        callback();
      } else {
        return callback(new Error('邮箱格式不正确'));
      }
    };

    return {
      deptlist: [],
      formLabelWidth: '48px',
      ruleForm: {
        username: 'sss',
        phone: '18236994069',
        email: '2830164237@qq.com',
        authorityIds: [],
        deptId: null,
        password: '123456',
        nickName: '默认昵称'

      },
      authorityList: [],
      // el-tree-selection 插件
      // 选中的id
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
      },
      value: null,
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        serial: [
          {
            validator: checkSerial,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: checkUsedPhone,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ]
      }
    };
  },

  created() {
    const data = { 'page': 1, 'pageSize': 100 };
    getDeptList(data).then((res) => {
      this.treeParams.data = res.data.list;
      this.$refs.treeSelect.treeDataUpdateFun(res.data.list);
      // console.log(this.treeParams.data);
    });
    getAuthorityList(data).then((res) => {
      this.authorityList = res.data.list;
      // console.table(this.authorityList);
    });
    // console.log(this.deptList);
  },
  methods: {
    Selectrole() {
      this.$emit('update:show', true);
      this.$emit('update:titles', ['角色']);
      const data = [];
      this.selectrolelist.forEach((res) => {
        data.push(res.authorityId);
      });
      // // selectrolelist
      console.log(data);
      this.$emit('changeroleInfo', data);
    },
    getDept() {
      this.ruleForm.dept = this.checkDeptlist;
    },
    submitForm(formName) {
      this.selectrolelist.forEach((role) => {
        this.ruleForm.authorityIds.push(role.authorityId);
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          add(this.ruleForm).then(res => {
            this.$message({
              message: '邀请成功',
              type: 'warning'
            });
            this.reload();
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 树过滤
    _searchFun(value) {
      // console.log(value, '<--_searchFun');
      // 自行判断 是走后台查询，还是前端过滤
      // this.$refs.treeSelect.$refs.tree.filter(value);
      this.$refs.treeSelect.filterFun(value);
      // 后台查询
      // this.$refs.treeSelect.treeDataUpdateFun(treeData);
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
    _nodeClickFun(val) {
      // console.log(val);
    }

  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
    @font-face {
      font-family: 'iconfont';  /* Project id 3288768 */
      src: url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff2?t=1649420958600') format('woff2'),
          url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.woff?t=1649420958600') format('woff'),
          url('//at.alicdn.com/t/font_3288768_37qngtbyhp4.ttf?t=1649420958600') format('truetype');
    }
    .iconfont_gray {
      font-family:"iconfont" !important;
      font-size:14px;font-style:normal;
      margin-right: 10px;
    }
    .tab-hint{

      padding-left: 15px;
      li{
        color: #939393;
        font-size: 12px;
        text-align:left;
      }
    }
    ::v-deep .el-form-item__error{
       padding-top: 0px;
    }
    ::v-deep .el-form-item{
      margin-bottom: 15px;
      .el-form-item__content{
        .el-input{
         width: 470px;
          .el-input__inner{
            height: 32px;
            // width: 457px;
          }
          .el-input-group__prepend{
            padding: 0 0 0 10px;
          }
        }
      }
      &:nth-child(1) .el-form-item__label:after{
        content: "*";
        color: #e64340;
      }
    }
    .form-group-list{
        padding-left: 45px;
    }
    .x-member-value-pane{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      align-items: flex-start;
      height: 90px;
      padding:0;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px dashed #d9d9d9;
      margin-left: 5px;
      cursor: pointer;
      .checked_dept{
        width: 143px;
        height: 32px;
        color: $address_btn_color;
        margin: 25px auto;

      }
       .select-item{
            display: inline-block;
            margin: 4px 0 0 5px;
            padding: 0px 10px;
            background: #f3f6fc;
            border-radius: 1px;
            .iconfont{
             color: #fa0;
             margin-right: 4px;
             font-size: 14px;
             display: inline-block;
             width: 20px;
             height: 20px;
             line-height: 20px;
             vertical-align: middle;
           }
            .iconfont-role{
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
    // footer
    .footer{
       display: flex;
    .el-button{
      &:nth-child(1){
        background-color: $address_btn_color;
        margin-left: 50px;
      }
    }
    }
    ::v-deep .el-tree-select{
      .el-select{
        .el-input{
          line-height: 32px;
          .el-input__suffix{
            display: flex;
            align-items: center;
          }
        }
      }
    }
</style>
