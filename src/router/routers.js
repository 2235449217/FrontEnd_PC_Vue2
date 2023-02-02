import Vue from 'vue';
import VueRouter from 'vue-router';
// import Dashboard from '../views/Home.vue';
const Panel = () => import('../views/Panel');
const FrameWork = () => import('../views/AddressList/FrameWork');
const Organization = () => import('../views/AddressList/Organization');
const Process = () => import('../views/ProcessCenter/ProcessCenter');
const Personal = () => import('@/views/UserSetting');

Vue.use(VueRouter);

export const constantRouterMap = [
  {
    path: '/',
    component: resolve => require(['@/views/Home'], resolve),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        // component: resolve => require(['@/views/Home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', affix: true, noCache: true }
      }
    ]
  },
  // 个人中心
  {
    path: '/personal',
    name: 'personal',
    component: Personal
  },
  // 流程中心
  {
    path: '/process/:task',
    name: 'process',
    component: Process
  },
  {
    path: '/app/:appID',
    name: 'app',
    component: Process,
    children: [
      {
        path: 'process/:task',
        name: 'process'
        // component: Process
      },
      {
        path: 'form/:appID',
        name: 'process',
        component: Process
      },
      {
        path: '',
        redirect: 'process/todo'
      }
    ]
  },
  // 通讯录
  {
    path: '/Panel',
    component: Panel,
    children: [
      {
        path: 'FrameWork',
        component: FrameWork
      },
      {
        path: 'Organization',
        component: Organization
      },
      {
        path: '',
        component: Organization
      }
    ]
  },
  {
    path: '/crud',
    name: 'crud',
    component: resolve => require(['@/components/Crud/CRUD.operation'], resolve)
  },
  {
    path: '/editflow/:id',
    name: 'EditFlow',
    component: resolve => require(['@/views/EditFlow'], resolve),
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'form',
        name: 'Form',
        component: resolve => require(['@/views/Form'], resolve)
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'lf',
        name: 'LF',
        component: resolve => require(['@/views/LF'], resolve)
      },
      {
        path: 'publish',
        name: 'Publish',
        component: resolve => require(['@/views/Publish'], resolve)
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: resolve => require(['@/views/Login'], resolve)
  },
  // {
  //   path: '/lf',
  //   name: 'LF',
  //   component: resolve => require(['@/views/LF'], resolve)
  // },
  {
    path: '/form',
    name: 'Form',
    component: resolve => require(['@/views/Form'], resolve)
  },
  {
    path: '/usersetting',
    name: 'UserSetting',
    component: resolve => require(['@/views/UserSetting'], resolve)
  },
  {
    path: '/formSubmission',
    name: 'FormSubmission',
    component: resove => require(['@/components/formgenerator/formSubmission'], resove)
  },
  {
    path: '/componentApproval',
    name: 'ComponentApproval',
    component: resove => require(['@/components/home/ComponentApproval'], resove)
  }
];

export default new VueRouter({
  mode: 'hash',
  routes: constantRouterMap
});
