<template>
  <el-container>
    <switch-nav :btn-list="btnList" :app-name="'通讯录'" @getTitle="getTitle">
      <div slot="btn">11</div>
    </switch-nav>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import SwitchNav from '@/components/SwitchNav';
export default {
  components: {
    SwitchNav
  },
  data() {
    return {
      isshow: 0,
      btnList: [
        { title: '组织架构', path: 'Organization',
          fn: () => {
            this.$router.push('/Panel/Organization');
          } },
        { title: '权限管理', path: 'FrameWork',
          fn: () => {
            this.$router.push('/Panel/FrameWork');
          } }
      ]
    };
  },
  created() {
  },
  methods: {
    getTitle(str) {

    }
  }
};
</script>
<style lang="scss" scoped>
$color: #0db3a6;
.el-container {
  font-family: -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
    Noto Color Emoji;
  height: 100vh;
  display:flex;
  flex-direction: column;
  background: #f4f5f5;
}
/* 头部导航栏 */
.el-header {
  // position: fixed;
  // top: 0;
  // right: 0;
  // left: 0;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  height: 60px;
  padding: 0 10px;
  font-size: 16px;
  line-height: 30px;
  background: #fff;
  box-shadow: 0 0 8px 0 rgb(0 0 0 / 10%);
}
.navigation-left,
.navigation-center,
.navigation-center {
  display: flex;
  align-items: center;
}
i.iconfont-fx-pc.icon-angle-left:before {
  content: "\e632";
}
.navigation-left .title {
  margin: 0 8px;
  font-size: 18px;
}
.navigation-center {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.el-icon-arrow-left {
  position: relative;
  color: $color;
  font-weight: 500;
  font-size: 30px;
  left: 5px;
}
.navigation-center div {
  cursor: pointer;
  width: 68px;
  height: 55px;
  padding: 0px 18px;
}
.navigation-center-left,
.navigation-center-right {
  :hover {
    color: $color;
  }
}
.navigation-center-left span,
.navigation-center-right span {
  position: absolute;
  top: 0;
  display: block;
  width: 64px;
  height: 55px;
  line-height: 55px;
}
.active {
  transition: border-bottom 0.2s, transform 0.2s;
  color: $color;
  border-bottom: 5px solid $color;
}
/* 内容 */
.el-main {
  color: #333;
  text-align: center;
  flex-grow: 1;
  // padding: 0;
  padding-top:20px 0 0 0 ;
}
</style>
