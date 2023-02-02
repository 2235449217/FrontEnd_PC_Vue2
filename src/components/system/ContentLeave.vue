<template>
  <div class="Content">
    <div class="wrapper-title">
      离职成员
    </div>
    <div class="member-btn-pane">
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
        v-loading="loading"
        :data="tablelist"
        tooltip-effect="dark"
        :sortable="false"
        style="width: 100%"
        @cell-click="handleClick"
      >
        <el-table-column prop="userName" label="姓名" width="313">
          <span slot-scope="scope">
            <div class="headImg">
              <img :src="'https://www.cppwnn.top/api/'+scope.row.headerImg" alt="">
              {{ scope.row.userName }}
            </div>
          </span>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="313" />
        <el-table-column label="角色">
          <span slot-scope="scope">
            <!-- 111 -->
            <div v-for="(item,index) in scope.row.authorities" :key="index" class="show_role">
              111
              <i class="iconfont_gray" styles="Blue">&#xe606;</i>
              <span>{{ item.authorityName }}</span>
            </div>
          </span>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      layout=" total,prev, pager, next"
      :total="totalnum"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import { getUserListDeleted } from '@/api/System/user';

export default {
  props: {
    memberlistAll: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      tablelist: [{
      }],
      loading: false
    };
  },
  computed: {
    totalnum() {
      return this.memberlistAll.length;
    }
  },
  created() {
    // 调用接口;
    // this.tablelist = this.memberlistAll;
    // console.log(this.tablelist);
    this.loading = true;
    const data = {
      'page': 1,
      'pageSize': 10
    };
    getUserListDeleted(data).then(res => {
      this.tablelist = res.data.list;
      this.loading = false;
    });
  },
  mounted () {

  },
  methods: {
    changePage(val) {
      this.loading = true;
      const data = {
        'page': 1,
        'pageSize': 10
      };
      data.page = val;
      getUserListDeleted(data).then(res => {
        this.tablelist = res.data.list;
        this.loading = false;
      });
    },
    handleSelectionChange(val) {
      console.log('11');
    },
    selectable() {
      console.log('11');
    },
    handleClick(row, column, cell, event) {
      console.log(row);
      console.log('11');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';
::v-deep .el-table__header {
  width: 100%;
  border-top: 1px solid #e9e9e9;

}
::v-deep .el-table__row{
  &:hover{
    background-color:$address_option_color;
  }
}
::v-deep .el-table__header {
  height: 40px;
}
::v-deep .el-table__header-wrapper {
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-table__body-wrapper {
  margin-top: 5px;
  // height: 40px;
  font-size: 13px;
  display: flex;
  align-items: center;
  table{
    tr{
      .cell{
        span{
          .headImg{
            img{
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
}
::v-deep .el-table tr {
  text-align: left;
  height: 38px;
}
.Content{
  .wrapper-title{
    font-weight: bold;
    padding: 0 20px;
    font-size:14px;
    text-align: left;
    line-height: 50px;
    border-bottom: 1px solid #e9e9e9;
  }
  .group-config {
  margin: 0 20px;
  background-color: #dbadad;
    .header_box {
    height: 32px;
  }
}
}
// 表格样式 后面抽离
::v-deep .el-table__header-wrapper table thead tr{
  font-size: 13px;
  border-bottom: 1px solid #e9e9e9;
  height: 42px;
  color: #1f2d3d;
}
.member-btn-pane{
  display: flex;
  align-items: center;
  height:48px;
  position: relative;
}
   .x-search-input {
     position: absolute;
     right: 20px;
     text-align: right;
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
    //分页样式
    .el-pagination{
      position: absolute;
      bottom: 15px;
      right:0;
    }
</style>

