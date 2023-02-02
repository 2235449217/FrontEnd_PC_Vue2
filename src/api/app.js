import request from '@/utils/request';

export function getAppList () {
  return request({
    url: 'api/app/list',
    method: 'get'
  });
}

export function createApp (data) {
  return request({
    url: 'api/app',
    method: 'post',
    data
  });
}

export function updateApp (data) {
  return request({
    url: 'api/app',
    method: 'put',
    data
  });
}

export function deleteApp (data) {
  return request({
    url: 'api/app',
    method: 'delete',
    data
  });
}

// 返回当前app下的表单
export function geteEmpty (params) {
  return request({
    url: '/api/app/empty',
    method: 'get',
    params
  });
}

// 添加应用流程
export function saveFlow (data) {
  return request({
    url: 'api/app/flow',
    method: 'post',
    data
  });
}

// 添加启用流程
export function startFlow (data) {
  return request({
    url: 'api/app/enable',
    method: 'post',
    data
  });
}

// 应用权限分配
export function setAuthority (data) {
  return request({
    url: 'api/app/authority',
    method: 'post',
    data
  });
}
