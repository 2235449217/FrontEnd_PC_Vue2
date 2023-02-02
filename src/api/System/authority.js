// import request from '@/utils/request';
import request from '@/utils/request';
// import {  } from '@/api/System/user';
// 分页获取角色列表
export function getAuthorityList(data) {
  return request({
    url: 'api/authority/getAuthorityList',
    method: 'POST',
    data
  });
}
export function add(data) {
  return request({
    url: '/api/authority/createAuthority',
    method: 'POST',
    data
  });
}
export function del(data) {
  return request({
    url: '/api/authority/deleteAuthority',
    method: 'POST',
    data
  });
}
export function change (data) {
  return request({
    url: '/api/authority/updateAuthority',
    method: 'POST',
    data
  });
}
// 角色下批量添加用户
export function addUserList(data) {
  return request({
    url: 'api/authority/addUserList',
    method: 'POST',
    data
  });
}
// 角色下批量移除用户
export function deleteUserList(data) {
  return request({
    url: 'api/authority/deleteUserList',
    method: 'POST',
    data
  });
}
