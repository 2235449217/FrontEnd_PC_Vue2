import router from './routers';
import store from '@/store';
import Config from '@/settings';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';// progress bar style
import { getToken } from '@/utils/auth'; // getToken from cookie

NProgress.configure({ showSpinner: false });// NProgress Configuration
// 白名单
const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title;
  }
  // 插件展示页面加载进度条
  NProgress.start();
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.getters.authorities && store.getters.authorities.length === 0) { // 判断当前用户是否已拉取完user_info信息
        // store.dispatch('GetInfo').then(res => { // 拉取user_info
        //   // 获取信息后干什么

        // }).catch((err) => {
        //   console.log(err);
        //   store.dispatch('LogOut').then(() => {
        //     location.reload(); // 为了重新实例化vue-router对象 避免bug
        //   });
        // });
        // 登录时未拉取 菜单，在此处拉取
      } else {
        next();
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});
router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
