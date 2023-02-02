<template>
  <div>
    <div class="nav">
      <div class="nav-left">
        <div class="nav-logo">
          paperless
        </div>
        <div v-show="showArrow" class="nav-arrow iconfont icon-wf-youjiantou1" />
        <slot name="btn" />
      </div>
      <div class="nav-items">
        <div
          class="nav-item-btn"
          @click="$router.push('/panel')"
        >
          组织架构
        </div>
        <UserAvatar />
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue';
export default {
  components: { UserAvatar },
  props: {
    showArrow: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import "@/styles/color.scss";
.nav{
  width:100%;
  height:60px;
  display: flex;
  justify-content:space-between;
  box-sizing: border-box;
  padding:0 30px;
  .nav-left{
    display: flex;
    align-items:center;
    justify-content:center;
    .nav-arrow{
      margin-left:10px;
    }
  }
  .nav-logo{
    align-self:center;
  }
  .nav-items{
    display:flex;
    align-items:center;
    .nav-item-btn{
      cursor: pointer;
      align-self: center;
      transition: color 0.2s ease;
      &:before {
        @include iconfont;
        content:'\e6ab';
        position: relative;
        left:0;
        width: 100%;
        height:100%;
        margin-right:5px;
      }
      &:hover{
        color:$base;
      }
    }
  }
}
</style>
