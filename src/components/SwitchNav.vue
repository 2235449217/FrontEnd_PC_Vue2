<template>
  <div>
    <div class="nav">
      <div class="nav-left">
        <div class="iconfont icon-wf-guanbi" @click="$router.push('/')" />
        <!-- <el-input v-model="inputText" class="input" placeholder="请输入标题" @input="sendChange" /> -->
        {{ appName }}
      </div>
      <div class="nav-btns">
        <div
          v-for="(item,index) in btnList"
          :key="index"
          :class="`btn ${curIndex === index ? 'selected' : ''}`"
          @click="handleClick(item.fn, index)"
        >
          <div>
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="nav-items">
        <!-- 用户头像组件 -->
        <UserAvatar />
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar.vue';

export default {
  name: 'SwitchNav',
  components: { UserAvatar },
  props: {
    appName: {
      type: String,
      default: '未命名的应用'
    },
    btnList: {
      type: Array,
      default: () => [
        {
          // 按钮显示的名字
          title: 'example',
          // 根据路由匹配当前激活的按钮
          path: 'url',
          // 按钮的点击事件
          fn: () => {
            console.log('this is an example');
          }
        }
      ]
    }
  },
  data() {
    return {
      curIndex: 0,
      inputText: '未命名的表单'
    };
  },
  created() {
    // 每次刷新后根据路由判断激活哪个按钮
    const path = this.$route.path;
    const aimStr = path.substring(path.lastIndexOf('/') + 1);
    this.btnList.map((item, index) => {
      if (item.path === aimStr) {
        this.curIndex = index;
      }
    });
  },
  methods: {
    handleClick(fn, index) {
      this.curIndex = index;
      fn();
    },
    sendChange(str) {
      this.$emit('getTitle', str);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import "@/styles/color.scss";
@import "@/styles/input.scss";
.nav{
  width:100%;
  height:60px;
  display: flex;
  justify-content:space-between;
  box-sizing: border-box;
  padding:0 30px;
  background-color:#fff;
  z-index: 100;
  .nav-left{
    display: flex;
    align-items:center;
    justify-content:center;
    .nav-arrow{
      margin-left:10px;
    }
  }
  .nav-btns{
    display: flex;
    align-items:center;
    justify-content:center;
    .btn{
      position: relative;
      display: inline-block;
      vertical-align: middle;
      padding: 19px 0;
      margin: 0 17px;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &::after{
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        height: 4px;
        background: #0DB3A6;
        transform: scaleY(0);
        transform-origin: bottom;
        opacity: 0;
        transition: all .3s cubic-bezier(.42,0,1,1);
        content: '';
      }
    }
    .selected{
      color: #0DB3A6;
      font-weight: 500;
      &::after {
        transform: scaleY(1);
        opacity: 1;
        transition: all .3s cubic-bezier(0,0,.58,1);
      }
    }
  }
  .nav-logo{
    align-self:center;
  }
  .nav-items{
    display:flex;
    align-items:center;
  }
}
.input{
  position:absolute;
  min-width:80px;
  max-width:200px;
  left:70px;
  border: none;
  border-bottom: 1px dashed rgba(125,125,125);
}
>>>.el-input__inner{
  border: none;
}
</style>
