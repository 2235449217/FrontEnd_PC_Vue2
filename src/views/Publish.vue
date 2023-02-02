<template>
  <div class="container">
    <div class="content">
      <div class="publish-box">
        <div class="flex-box">
          <div class="flex-left">
            <div class="flex-left-btns">
              <div class="items active">
                对成员发布
              </div>
            </div>
          </div>
          <div class="flex-right">
            <div class="flex-right-header">
              对成员发布
              <span class="tip">使用此方式发布表单，填写或管理数据时需登录并授权</span>
            </div>
            <div class="flex-right-body">
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="用户管理" name="first">
                  <!-- <div class="flex-right-content">
                    <el-button>默认按钮</el-button>
                  </div> -->
                  <div class="items-title">
                    发起新流程
                  </div>
                  <div class="tip">
                    在此分组内的成员可以发起流程
                  </div>
                  <ul v-if="idArray.authorityIds || idArray.dept || idArray.memeber" class="x-memeber-value-pane" @click="Selectrole">
                    <li v-for="(item,index) in authorities" :key="'role'+index" class="select-item">
                      <i class="iconfont-role">&#xe606;</i>
                      <span>{{ item.authorityName }}</span>
                    </li>
                    <li v-for="(item,index) in dept" :key="'dept'+index" class="select-item">
                      <i class="iconfont-role">&#xe606;</i>
                      <span>{{ item.deptName }}</span>
                    </li>
                    <li v-for="(item,index) in memeber" :key="'memeber'+index" class="select-item">
                      <i class="iconfont">&#xe604;</i>
                      {{ item.nickName }}
                    </li>
                  </ul>
                  <ul v-else class="x-memeber-value-pane" @click="Selectrole">
                    <div class="checked_dept">
                      + 点击选择角色
                    </div>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Process
      v-if="show"
      :show.sync="show"
      :titles="titles"
      :deptlist="deptList"
      :authoritylist="authoritylist"
      :appinfo="appinfo"
      :allmember="allmember"
      @changeAppInfo="changeAppInfo"
      @confirmSend="confirmSend"
    />
  </div>
</template>

<script>
import Process from '@/components/common/Process';
import { getAuthorityList } from '@/api/System/authority';
import { getUserList } from '@/api/System/user';
import { getDeptList } from '@/api/System/dept';
import { setAuthority } from '@/api/app';

import { findTree } from '@/utils/index';
export default {
  components: { Process },
  data () {
    return {
      activeName: 'first',
      titles: ['组织架构', '角色', '成员'],
      authoritylist: [],
      deptList: [],
      appinfo: {
        'dept': [],
        'role': [],
        'memeber': []
      },
      allmember: [],
      show: false,
      data: {
        'page': 1,
        'pageSize': 1000
      },
      idArray: {
      },
      authorities: null,
      dept: null,
      memeber: null,
      selectRoleList: [],
      selectDeptList: [],
      selectmemeberList: []
    };
  },
  created() {
    // 获取全部成员
    getUserList(this.data).then((res) => {
      this.allmember = res.data.list;
    });
    getAuthorityList(this.data).then(res => {
      this.authoritylist = res.data.list;
    });
    getDeptList(this.data).then(res => {
      this.deptList = res.data.list;
    });
  },
  methods: {
    Selectrole() {
      this.show = true;
      this.appinfo['role'] = this.idArray.authorityIds || [];
      this.appinfo['dept'] = this.idArray.dept || [];
      this.appinfo['memeber'] = this.idArray.memeber || [];

      console.log(this.appinfo);
    },
    changeAppInfo(val) {
      this.appinfo = val;
      this.idArray.authorityIds = this.appinfo['role'];
      this.idArray.dept = this.appinfo['dept'];
      this.idArray.memeber = this.appinfo['memeber'].map(item => {
        return item.id;
      });
      // 选中数组清空
      this.selectRoleList = [];
      this.selectDeptList = [];
      this.selectmemeberList = [];
      // 在此添加
      this.authoritylist.forEach(res => {
        this.idArray.authorityIds.forEach(item => {
          if (res.authorityId === item) {
            this.selectRoleList.push(res);
          }
        });
      });

      const idSet = new Set(this.idArray.dept);
      findTree(this.deptList, idSet, this.selectDeptList);

      this.allmember.forEach(res => {
        this.idArray.memeber.forEach(item => {
          if (res.ID === item) {
            this.selectmemeberList.push(res);
          }
        });
      });
      this.authorities = this.selectRoleList;
      this.dept = this.selectDeptList;
      this.memeber = this.selectmemeberList;

      setAuthority({
        appId: Number(this.$route.params.id),
        authoritys: this.idArray.authorityIds,
        depts: this.idArray.dept,
        users: this.idArray.memeber
      });
    },
    confirmSend(value) {
      console.log(value);
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
.container {
  top: 60px;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}
.content{
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f4f6f9;
}
.publish-box{
  width: 1000px;
  height: 100%;
  padding: 20px 0;
  overflow: hidden;
  box-sizing: border-box;
  .flex-box{
    position: relative;
    display: flex;
    height: 100%;
    background-color: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    .flex-left{
      width: 180px;
      padding-top: 16px;
      border-right: 1px solid #e9e9e9;
      .flex-left-btns{
        position: static;
        transform: translate(0px, 0px);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: transform .2s ease,-webkit-transform .2s ease;
        .items{
          font-size: 14px;
          display: block;
          max-width: none;
          height: 40px;
          padding: 0 20px;
          line-height: 40px;
          background: transparent;
          -webkit-transition: background .1s ease-out;
          transition: background .1s ease-out;
          cursor: pointer;
        }
        .active{
          background-color: #e7f7f6;
          color: #0db3a6;
          &::before{
            position: absolute;
            right: 15px;
            background: #0db3a6;
            top: 0;
            bottom: auto;
            left: 0;
            width: 3px;
            height: 100%!important;
            content: "";
          }
        }
      }
    }
    .flex-right{
      overflow-y: auto;
      flex: auto;
      .flex-right-header{
        font-weight: 600;
        position: relative;
        line-height: 40px;
        height: 47px;
        padding: 0 20px;
        font-size: 16px;
        line-height: 47px;
        border-bottom: 1px solid #e9e9e9;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .header{
          height: 47px;
          padding: 0 20px;
          font-size: 16px;
          line-height: 47px;
          border-bottom: 1px solid #e9e9e9;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 12px;
        }
      }
      .tip{
        color: #91a1b7;
        font-size: 12px;
        font-weight:200;
        line-height: 18px;
      }
      .flex-right-body{
        >>>.el-tabs__content{
          padding: 16px 20px;
        }
        .items-title{
          font-size: 14px;
          display: block;
          flex: auto;
          margin-right: 50px;
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
.x-memeber-value-pane{
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          align-items: flex-start;
          height: 100px;
          width: 100%;
          padding:0;
          overflow-x: hidden;
          overflow-y: auto;
          border: 1px dashed #d9d9d9;
          cursor: pointer;
          .checked_dept{
            width: 143px;
            height: 30px;
            line-height: 30px;
            color: $address_btn_color;
            margin: 35px auto;

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
>>>.el-tabs__nav-scroll{
  padding: 16px 20px 0;
}
>>>.el-tabs__item.is-active {
    color: #0db3a6;
}
</style>
