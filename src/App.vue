<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>
<style lang="scss">
@import url(//at.alicdn.com/t/font_3288768_jqfm0hkuedl.css);
@import "./styles/scollbar.scss";
@import "./styles/color.scss";
@import "./icons/iconfont/iconfont.css";
body{
  overflow-x:hidden
}
// 此处用于home页面更改popover的样式
.home-custom-pop{
  padding:12px 4px !important;
  .el-popover__title{
    padding:0 12px;
  }
}
// 此处用于流程图页面的下拉列表样式
.custom-select .el-select-dropdown__item.hover{
  background-color: $select-item-hover;
}
.custom-select .el-select-dropdown__item.selected{
  background-color: $select-item-selected;
  color:#fff;
}
</style>
