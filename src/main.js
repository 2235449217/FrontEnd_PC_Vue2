import Vue from 'vue';
import App from './App.vue';
import 'normalize.css/normalize.css';

import router from './router/routers';
import './router/index'; // permission control

import store from './store';
// eslint-disable-next-line no-unused-vars
import ELEMENT from 'element-ui';
import mylocation from './components/formgenerator/mylocation';
import memberSingleChoice from './components/formgenerator/memberSingleChoice';
import multiMemberSelection from './components/formgenerator/multiMemberSelection';
import departmentSingleChoice from './components/formgenerator/departmentSingleChoice';
import multiDepartmentSelection from './components/formgenerator/multiDepartmentSelection';
// 基于 element-ui 2.x 扩展下拉带树的组件 下拉树状菜单
import ElTreeSelect from 'el-tree-select';

import Tinymce from '@/components/formgenerator/tinymce/index.vue';
import '@/icons'; // svg component

// Vue.component('svg-icon', SvgIcon);
Vue.component('Tinymce', Tinymce);
Vue.component('Mylocation', mylocation);
Vue.component('MemberSingleChoice', memberSingleChoice);
Vue.component('MultiMemberSelection', multiMemberSelection);
Vue.component('DepartmentSingleChoice', departmentSingleChoice);
Vue.component('MultiDepartmentSelection', multiDepartmentSelection);
// Vue.component('ElTreeSelect', ElTreeSelect);
Vue.use(ElTreeSelect);

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
