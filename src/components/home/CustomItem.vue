<template>
  <div class="custom-box">
    <div class="icon-box">
      <div
        :class="`icon `+`${iconName}`"
        :style="`background-image:linear-gradient(${colorFrom},${colorTo})`"
      />
    </div>
    <div v-if="showText" class="font-box">
      <span>{{ describe }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
      default: () => {
        return 'el-icon-s-claim';
      }
    },
    colorFrom: {
      type: String,
      default: () => {
        return `#f4cf54`;
      }
    },
    colorTo: {
      type: String,
      default: () => {
        return `#e89121`;
      }
    },
    describe: {
      type: String,
      default: () => {
        return '未命名的应用';
      }
    },
    showText: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  methods: {
    goto() {
      console.log('跳转页面');
    }
  }
};
</script>
<style lang="scss" scoped>
// $hover-color:#e9e9e9;
// $bg:#fff;
  .custom-box {
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
  }
  .icon-box{
    .icon{
      font-size:35px;
      color: white;
      padding:10px;
      border-radius: 12px;
    }
  }

  .font-box{
    margin-top: 8px; // 这里加margin是为了在应用图标那边显示
    font-size: 16px;
  }

</style>
