import request from '@/utils/request';
// 获取所有api
export function getAllApis() {
  return request({
    url: '/api/api/getAllApis',
    method: 'POST'
  });
}
// 更新角色api
export function UpdateCasbin(data) {
  return request({
    url: 'api/casbin/updateCasbin',
    method: 'POST',
    data
  });
}
// 获取权限列表
export function getPolicyPathByAuthorityId(data) {
  return request({
    url: '/api/casbin/getPolicyPathByAuthorityId',
    method: 'POST',
    data
  });
}
// 根据apiID获取单个api
export function getApiById(data) {
  return request({
    url: '/api/api/getApiById',
    method: 'POST',
    data
  });
}
// 获取一组api列表
export function getApiList(data) {
  return request({
    url: '/api/api/getApiList',
    method: 'POST',
    data
  });
}

