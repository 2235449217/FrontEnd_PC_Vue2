import { login, getInfo, logout } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    // 消息列表
    notices: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      console.log(user);
      state.user = user;
    },
    SET_ROLES: (state, roles) => {
      state.authorities = roles;
    }
    // SET_LOAD_MENUS: (state, loadMenus) => {
    //   state.loadMenus = loadMenus;
    // }
    // V1.0项目不确定是否有消息通知
    // SET_NOTICE: (state, list) => {
    //   state.notices = list;
    // }
  },

  actions: {
    // 登录
    Login ({ dispatch, commit }, userInfo) {
      const rememberMe = userInfo.rememberMe;
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.captcha, userInfo.captchaId).then(res => {
          setToken(res.data.token, rememberMe);
          commit('SET_TOKEN', res.data.token);
          setUserInfo(res.data.user, commit);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // GetNotice ({ commit }, userId) {
    //   return new Promise((resolve, reject) => {
    //     // 发请求获取所有信息，通过回调commit SET_NOTICE   //TODO
    //   });
    // },
    // 获取用户信息
    GetInfo ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res.data, commit);
          // dispatch('setList');
          resolve(res.data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit);
          resolve();
        }).catch(error => {
          logOut(commit);
          reject(error);
        });
      });
    }
  }
};

export const logOut = (commit) => {
  commit('SET_TOKEN', '');
  commit('SET_ROLES', []);
  removeToken();
};

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.authorities.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT']);
  } else {
    commit('SET_ROLES', res.authorities);
  }
  console.log(res, 'vuex');
  commit('SET_USER', res);
};

export default user;
