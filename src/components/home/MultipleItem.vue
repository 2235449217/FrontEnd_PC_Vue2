<template>
  <div class="step-wrapper" @click="goto">
    <div class="icon-box">
      <img class="step-image" :src="iconUrl">
    </div>
    <div class="font-box">
      <span>{{ describe }}</span>
    </div>
  </div>
</template>

<script>
import map from './routerMap';
export default {
  props: {
    iconUrl: {
      type: String,
      default: () => {
        return '';
      }
    },
    describe: {
      type: String,
      default: () => {
        return '';
      }
    },
    type: {
      type: String,
      default: () => {
        return 'todo';
      }
    }
  },
  methods: {
    goto() {
      this.$router.push('/process/' + map[this.type]);
    }
  }
};
</script>
<style lang="scss" scoped>
$hover-color:#f4f6f9;
.step-wrapper{
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  height: 120px;
  border-radius: 12px;
  &:hover {
    background-color:$hover-color;
    cursor:pointer;
  }
  // margin: 0 53px;
  // @media screen and (min-width: 1651px){
  //   margin: 0 53px;
  // }
  // @media screen and (max-width: 1440px){
  //   margin: 0 27px
  // }
  // @media screen and (max-width: 1230px){
  //   margin: 0 11px;
  // }
  .icon-box{
    align-self: center;
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
    .step-image{
      width: 40px;
      height: 40px;
      margin-bottom: 16px
    }
  }
  .font-box{
    display:flex;
    flex-direction:column;
    font-size: 16px;
  }
}
</style>
