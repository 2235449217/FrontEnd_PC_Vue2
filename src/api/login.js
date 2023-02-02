import request from '@/utils/request';

export function login (username, password) {
  return request({
    url: 'api/v1/login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}

export function getInfo () {
  return request({
    url: '/user/getUseInfo',
    method: 'get'
  });
}

export function getCodeImg () {
  return request({
    url: 'api/base/captcha',
    method: 'post'
  });
}

export function logout () {
  return request({
    url: 'api/base/logout',
    method: 'delete'
  });
}
