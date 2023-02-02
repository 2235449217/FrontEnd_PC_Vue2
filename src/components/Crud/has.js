export default {
  bind(el, bindings) {
    // 获取所有权限
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    // 需要的权限
    const needPermissions = bindings.value;
    const hasPermission = permissions.includes(needPermissions);
    if (!hasPermission) {
      // button 按钮还没有渲染完毕 前就进行删除 el为undefined 我们需要设置一个宏任务
      setTimeout(() => {
        el.parentNode.removeChild(el);
      }, 0);
    }
  }
};
