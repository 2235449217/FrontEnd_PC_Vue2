<template>
  <div class="container" @click="goto">
    <div class="icon-box">
      <img class="todo-image" src="@/assets/todo.png" alt="提示">
    </div>
    <div class="font-box">
      <span>我的待办</span>
      <span>{{ todoNum }}</span>
    </div>
  </div>
</template>

<script>
import map from './routerMap';
export default {
  props: {
    type: {
      type: String,
      default: () => {
        return 'todo';
      }
    },
    todoNum: {
      type: Number,
      default: () => 0
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
.container{
  display:flex;
  justify-content: center;
  align-items: center;
  height:100%;
  border-radius: 12px;
  &:hover {
    background-color:$hover-color;
    cursor:pointer;
  }
  .icon-box{
    width: 64px;
    height: 64px;
    margin-right: 12px;
    // @media screen and (min-width: 1651px){
    //   margin-right: 65px;
    // }
    // @media screen and (max-width: 1440px){
    //   margin-right: 56px;
    // }
    // @media screen and (max-width: 1230px){
    //   margin-right: 56px;
    // }
    .todo-image{
      width: 100%;
      height: 100%;
    }
  }
  .font-box{
    display:flex;
    flex-direction:column;
    span:nth-child(1){
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 5px;
    }
    span:nth-child(2){
      font-weight: 700;
      font-size: 36px;
    }
  }
}
</style>
