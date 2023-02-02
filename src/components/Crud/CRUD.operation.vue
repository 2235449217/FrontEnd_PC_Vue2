<template>
  <div>
    <h1>控制按钮权限测试</h1>
    <button v-has="'create'">邀请成员</button>
    <button v-has="'edit'">调整部门</button>
    <button v-has="'delete'">转为离职</button>
    <button v-has="'create'">修改信息</button>
  </div>
</template>
<script>
var roles = ['create', 'edit'];
localStorage.setItem('permissions', JSON.stringify(roles));
import hasDirective from './has';
export default {
  directives: {
    has: hasDirective
  }
};

</script>

<style>

</style>
