<template>
  <div class="organization">
    <div class="contacts-layout-main">
      <div class="layout-menu">
        <div class="menu-content">
          <div class="fx-organization-job">
            <!-- 部门子菜单 -->
            <div class="job-outline">角色管理</div>

            <div class="job-content">
              <div v-for="(item,index) in roleList" :key="index" class="fx-organization-content" :class="{content_active: index===id}" @click="toggle(item,index)">
                <span class="tab-content-inner">
                  <i class="iconfont ">&#xe601;</i>
                  <span class="inner-text">{{ item.authorityName }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Organization -->
      <div class="layout-content">
        <Authapi v-if="loading&&show" :currentapi="currentapi" :all-api="allApi" :role="role" />
      </div>
    </div> -->
    <div />
  </div>
</template>

<script>
import { getAuthorityList } from '@/api/System/authority';
// todo  UpdateCasbin,
import { getAllApis, getPolicyPathByAuthorityId } from '@/api/Casbin/casbin';

import Authapi from '@/components/system/casbin/Authapi';
export default {
  // 需要角色列表与相应权限列表
  name: 'FrameWork',
  components: {
    Authapi
  },
  data () {
    // var roleList = [];
    // roleList.map((item) => { item.isshow = false; });
    return {
      width: '',
      allApi: { base: [], jwt: [], user: [], authority: [], department: [], casbin: [], fileUploadAndDownload: [] },
      currentapi: { base: [], jwt: [], user: [], authority: [], department: [], casbin: [], fileUploadAndDownload: [] },
      isshow: 0,
      id: 0,
      roleList: [],
      // 存放单个对象信息
      role: {},
      data: {
        'page': 1,
        'pageSize': 100
      },
      show: false,
      loading: false
    };
  },
  created() {
    this.width = window.innerWidth;

    // 获取全部API
    this.show = false;
    getAllApis().then(res => {
      res.data.apis.forEach(item => {
        if (item.apiGroup === 'base') {
          this.allApi.base.push(item);
        } else if (item.apiGroup === 'jwt') {
          this.allApi.jwt.push(item);
        } else if (item.apiGroup === 'user') {
          this.allApi.user.push(item);
        } else if (item.apiGroup === 'authority') {
          this.allApi.authority.push(item);
        } else if (item.apiGroup === 'department') {
          this.allApi.department.push(item);
        } else if (item.apiGroup === 'fileUploadAndDownload') {
          this.allApi.fileUploadAndDownload.push(item);
        } else if (item.apiGroup === 'casbin') {
          this.allApi.casbin.push(item);
        }
      });
      this.show = true;
    });
    // 获取当前角色API
    const data = {};
    data.authorityId = 1;
    getPolicyPathByAuthorityId(data).then(res => {
      this.currentapi = { base: [], jwt: [], user: [], authority: [], department: [], casbin: [], fileUploadAndDownload: [] };
      res.data.paths.forEach(item => {
        const str = item.path.slice(5, 8);
        if (str === 'base') {
          this.currentapi.base.push(JSON.stringify(item));
        } else if (str === 'jwt') {
          this.currentapi.jwt.push(JSON.stringify(item));
        } else if (str === 'use') {
          this.currentapi.user.push(JSON.stringify(item));
        } else if (str === 'aut') {
          this.currentapi.authority.push(JSON.stringify(item));
        } else if (str === 'dep') {
          this.currentapi.department.push(JSON.stringify(item));
        } else if (str === 'fil') {
          this.currentapi.fileUploadAndDownload.push(JSON.stringify(item));
        } else if (str === 'cas') {
          this.currentapi.casbin.push(JSON.stringify(item));
        }
      });
      this.loading = true;
    });
    getAuthorityList(this.data).then(res => {
      this.roleList = res.data.list;
      this.role = res.data.list[0];
      console.log(this.role);
    });
  },
  methods: {
    // 操作分页
    toggle(item, index) {
      this.role = item;
      this.loading = false;
      this.id = index;
      const data = {};
      data.authorityId = item.authorityId;
      getPolicyPathByAuthorityId(data).then(res => {
        this.currentapi = { base: [], jwt: [], user: [], authority: [], department: [], casbin: [], fileUploadAndDownload: [] };
        if (res.data.paths === null) {
          this.loading = true;
          return;
        }
        res.data.paths.forEach(item => {
          const str = item.path.slice(5, 8);
          if (str === 'base') {
            this.currentapi.base.push(JSON.stringify(item));
          } else if (str === 'jwt') {
            this.currentapi.jwt.push(JSON.stringify(item));
          } else if (str === 'use') {
            this.currentapi.user.push(JSON.stringify(item));
          } else if (str === 'aut') {
            this.currentapi.authority.push(JSON.stringify(item));
          } else if (str === 'dep') {
            this.currentapi.department.push(JSON.stringify(item));
          } else if (str === 'fil') {
            this.currentapi.fileUploadAndDownload.push(JSON.stringify(item));
          } else if (str === 'cas') {
            this.currentapi.casbin.push(JSON.stringify(item));
          }
          this.loading = true;
        });
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
.iconfont {
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
  /* 高度塌陷 */
  height: 715px;
  width: 100%;
  min-width: 1280px;
  max-width: 1600px;
  margin: 0 auto;
}
.contacts-layout-main {
  display: flex;
  height: 715px;
    // max-width: 1600px;
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
}

/* 内容 */
.fx-organization-job,
.fx-organization-role {
  display: flex;
  flex-direction: column;
}
// 子菜单
.job-outline {
  text-align: left;
  margin: 15px 15px 6px;
  height: 28px;
  font-size: 14px;
  padding-left: 15px;
  font: size 14px;
  line-height: 28px;
  color: #91a1b7;
  border-bottom: 1px solid rgb(248, 246, 246);
}
.fx-organization-content {
  //   position: relative;
  text-align: left;
  max-width: none;
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
}
.job-content {
  position: relative;
}
.tab-content-inner {
  display: block;
  position: absolute;
  left: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
//动态属性
.icon-menu {
  display: none;
}
/* todo 动态属性 */
.j_r_active {
  border-left: 1px solid $address_btn_color;
  background-color: $address_btn_color;
  color: #1f2d3d;
  border-color: $address_btn_color;
}
.content_active {
  border-left: 2px solid $address_btn_color;
  background-color: #e6f6f4;
}
/**右看板 */
//right
.layout-content {
  width: 1308px;
  height: 715px;
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  position:relative;
}
.organization-content-right {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.depart-info {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #e9e9e9;
}
.member-btn-pane {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  margin: 0 20px;
}
.member-table-content {
  position: relative;
  display: flex;
  flex: auto;
  flex-direction: column;
  margin: 0 20px 10px;
}
.layout-content .organization-content-right .depart-info .depart-name {
  flex: auto;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
