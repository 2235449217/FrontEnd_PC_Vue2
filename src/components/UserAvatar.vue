<template>
  <div class="nav-item-avatar">
    <!-- 点击头像出现的下拉列表 -->
    <el-popover placement="bottom" width="200" title="coderXu" trigger="click" popper-class="home-custom-pop">
      <div class="avatar-options">
        <div class="options-header">
          <div class="options-type">
            测试
          </div>
          <div class="options-tag">
            我创建的
          </div>
        </div>
        <div class="border" />
        <div class="options-body">
          <div
            class="options-item"
            @click="$router.push('/usersetting')"
          >个人设置</div>
        </div>
        <div class="border" />
        <div class="options-footer">
          <div class="options-item" @click="logout">退出</div>
        </div>
      </div>
      <div slot="reference">
        <el-avatar size="small" :src="avatarUrl" />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: {
      type: String,
      default: () => require('../assets/start.png')
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$Message({
          text: '登出成功'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.nav-item-avatar{
  margin-left: 12px;
  cursor: pointer;
}
>>>.options-header{
  display:flex;
  justify-content:space-between;
  box-sizing: border-box;
  align-items:center;
  padding:0 12px;
  .options-type{
    color: #91a1b7;
    font-size: 12px;
  }
  .options-tag{
    cursor:pointer;
    font-size: 13px;
    border: 1px solid $border;
    color: #5e6d82;
    background: #f7f7f7;
    padding:2px 4px;
    border-radius: 3px;
  }
}
>>>.options-item{
  line-height:36px;
  cursor: pointer;
  border-radius: 3px;
  padding:0 12px;
  &:hover{
    background:$list-hover
  }
}
>>>.border{
  margin:8px 0;
  width:100%;
  border: solid $border;
  border-width: 1px 0 0;
}
</style>
