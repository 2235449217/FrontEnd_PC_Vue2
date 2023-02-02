<template>
  <div>
    <div class="Content">
      <!-- 角色列表显示面板 -->
      <div class="wrapper-title">
        <!-- authoritymsg.authorityName -->
        <div class="content-left">{{ authoritymsg.title }}</div>
        <div class="content-right">
          <div @click="changename">修改名称</div>
        </div>
      </div>

      <div class="member-btn-pane">
        <div class="btn-group">
          <button class="x-button" @click="AddMember">添加成员</button>
          <button class="x-button" @click="DeleteMember">移出</button>
        </div>
        <div class="x-search-input">
          <div class="input-wrapper">
            <div class="input-content">
              <div class="input-prefix">
                <i class="iconfont x-iconfont" />
                <input type="text" placeholder="搜索成员">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="group-config">
        <el-table
          ref="multipleTable"
          :data="memberList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column prop="userName" label="姓名" width="505">
            <span slot-scope="scope">
              <div class="headImg">
                <img :src="'https://www.cppwnn.top/api/'+scope.row.headerImg" alt="">
                {{ scope.row.userName }}
              </div>
            </span>
          </el-table-column>
          <el-table-column prop="deptId" label="部门" />
          <el-table-column width="53" />
        </el-table>
      </div>
      <!-- 邀请成员表单 -->
      <Process
        v-if="show"
        title="添加成员"
        :show.sync="show"
        :titles="titles"
        :maplist.sync="maplist"
        :deptlist="deptlist"
        @changeAppInfo="changeAppInfo"
      />
    </div>
    <el-pagination
      layout=" total,prev, pager, next"
      :total="totalnum"
      @current-change="changePage"
    />
  </div>

</template>

<script>
import Process from '@/components/common/Process';
import { getDeptList } from '@/api/System/dept';
import { addUserList, deleteUserList } from '@/api/System/authority';
export default {
  inject: ['reload'],
  components: {
    Process
  },
  props: {
    authoritymsg: {
      type: Object,
      default() {
        return {};
      }
    },
    // 角色内成员
    memberList: {
      type: Array,
      default() {
        return [];
      }
    },
    memberlistAll: {
      type: Array,
      default() {
        return [];
      }
    },
    treedata: {
      type: Array,
      default() {
        return [];
      }
    }

  },
  data () {
    return {
      // 模拟数据 解决因为数据渲染造成的css问题
      // tablelist: [{ 'userName': 'zhangsan', 'deptID': 'NI' }],
      // 表格选中数据
      // Process 组件传值
      show: false,
      deptlist: [],
      authoritylist: [],
      // 测试数据
      data: {
        'page': 1,
        'pageSize': 10
      },
      // 选中内容
      maplist: [],
      // 角色内用户选中集合ID
      memberlistID: [],
      dialogDeptVisible: false,
      checkDeptlist: [],
      checkmemberList: [],
      // treedata: []
      // 多选框
      checkAll: false,
      //  默认选中项
      checkedCities: [],
      // 所有选项
      checkedOptions: [],
      // 选中状态
      isIndeterminate: true,
      // 高亮状态
      showTree: false,
      // 选中状态
      isContent: 0,
      deptId: 0

    };
  },
  computed: {
    totalnum() {
      return this.tablelist.length;
    }
  },
  created() {
    this.tablelist = this.memberList;
    // 获取部门 角色列表
    getDeptList(this.data).then(res => {
      this.deptlist = res.data.list;
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.checkmemberList = val;
    },
    selectable() {},
    // 移除角色内用户（修改角色）  移除跟修改逻辑不一样
    DeleteMember() {
      const data = {
        authorityId: null,
        userList: [33, 47]
      };
      // this.checkmemberList.forEach(res => {
      //   data.userList.push(res.ID);
      // });
      data.authorityId = this.authoritymsg.id;
      console.log(data);
      deleteUserList(data).then(res => {
        console.log(res);
      });
      // del(data).then(res => {
      //   this.$message({
      //     showClose: true,
      //     message: '成员已移除',
      //     type: 'success'
      //   });
      //   this.reload();
      // });
    },
    AddMember() {
      this.show = true;
      this.titles = ['成员'];
    },
    changePage() {},
    handleSizeChange() {

    },
    changename() {
      this.$message({
        message: '修改名称逻辑',
        type: 'warning'
      });
    },
    changeAppInfo(val) {
      const data = {
        authorityId: null,
        userList: []
      };
      val['memeber'].forEach(res => {
        data['userList'].push(res.id);
      });
      data.authorityId = this.authoritymsg.id;
      console.log(data);
      // this.memberlistID = data;
      // console.log(this.memberlistID);
      addUserList(data).then((res) => {
        console.log(res);
      });
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
::v-deep .el-table__header {
  width: 100%;
}
::v-deep .el-table__header-wrapper {
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-table__body-wrapper {
  margin-top: 5px;
  display: flex;
  align-items: center;
}
::v-deep .el-table tr {
  height: 38px;
  text-align:left;
}
::v-deep .el-table__row{
  &:hover{
    background-color:$address_option_color;
  }
}
.Content{
  .wrapper-title{
    padding: 0 20px;
    font-size:14px;
    text-align: left;
    font-weight: 500;
    line-height: 50px;
    border-bottom: 1px solid #e9e9e9;
    display:flex;
    justify-content: space-between;
    .content-left{
    font-weight: bold;
    }
    .content-right{
      color: $address_btn_color;
      display: flex;
      div:nth-child(1){
        margin-right:10px;
        cursor: pointer;
      }
      div:nth-child(3){
        margin-left:10px;
        cursor: pointer;
      }
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
          }
          input{
            font-size: 14px;
            padding: 6px 0 6px 35px;
            line-height: 1;
            background: #f4f4f4;
            border: none;
            border-radius: 18px;
            outline: none;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

    }
  }
  .content-center{
    padding: 0 32px;
    margin-top:5px;
    text-align: left;
  }
  .group-config {
  margin: 0 20px;
  background-color: #dbadad;
    .header_box {
    height: 32px;
  }
}
::v-deep .el-table__header-wrapper table thead tr{
  color:#1f2d3d ;
   border-bottom: 1px solid #e9e9e9;
  height: 34px;
  background-color: #f4f4f4;
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
     .dept-bottom-center{
       display: flex;
       width: 100%;
       .treeList_left{
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
        width: 50%;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        border-left: 1px solid #e0e0e0;
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
 ::v-deep .el-checkbox-group{
            .el-checkbox{
              // display: block;
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
                 left: 0px;
              }
            }
        }
 //复选框样式修改
 ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
   color:$address_btn_color ;
 }
 ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: $address_btn_color;
    border-color: $address_btn_color;
 }
 ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: $address_btn_color;
    border-color: $address_btn_color;
 }
 ::v-deep .el-checkbox .is-focus .el-checkbox__inner{
   border-color: $address_btn_color;
 }
 .el-pagination{
  // background-color:white;
  position: absolute;
  bottom: 15px;
  right:0;
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
</style>

<!-- get_member_all
get_member_leave -->
