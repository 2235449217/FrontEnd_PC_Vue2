import request from '@/utils/request';
// import {  } from '@/api/System/user';
// 获取全部成员
export function getUserList(data) {
  return request({
    url: 'api/user/getUserList',
    method: 'POST',
    data
  });
}
// 获取当前用户信息
export function getUserInfo(params) {
  return request({
    url: '/api/user/getUserInfo',
    method: 'GET',
    params
  });
}
// 分页查询
export function getUserListOrder(data) {
  return request({
    url: '/api/user/getUserListOrder',
    method: 'POST',
    data
  });
}
// 获取离职成员
export function getUserListDeleted(data) {
  return request({
    url: 'api/user/getUserListDeleted',
    method: 'POST',
    data
  });
}
// 根据角色ID获取用户
export function getUserByAuthority(data) {
  return request({
    url: 'api/user/getUserByAuthority',
    method: 'POST',
    data
  });
}
// 根据部门ID获取用户
export function getUserBydepartment(params) {
  return request({
    url: 'api/department/users',
    method: 'GET',
    params
  });
}
export function add(data) {
  return request({
    url: 'api/user/register',
    method: 'POST',
    data
  });
}
// 设置当前用户信息
export function change(data) {
  return request({
    url: 'api/user/setSelfInfo',
    method: 'PUT',
    data
  });
}
// 设置用户信息
export function changeuser(data) {
  return request({
    url: 'api/user/setUserInfo',
    method: 'PUT',
    data
  });
}
// 设置用户角色
export function setUserAuthorities(data) {
  return request({
    url: '/api/user/setUserAuthorities',
    method: 'PUT',
    data
  });
}
export function del(data) {
  return request({
    url: 'api/user/deleteUserList',
    method: 'DELETE',
    data
  });
}

export function login(data) {
  return request({
    url: 'api/base/login',
    method: 'POST',
    data
  });
}
// 修改密码
export function changePassword(data) {
  return request({
    url: '/api/user/changePassword',
    method: 'PUT',
    data
  });
}
// 导入用户Excel 文件
export function getimportExcel(data) {
  return request({
    url: '/api/department/importUser',
    method: 'POST',
    data
  });
}
export function loadDeptUser(params) {
  return request({
    url: '/api/department/loadDeptUser',
    method: 'GET',
    params
  });
}
// 下载模板
export function downloadTemplate(params) {
  return request({
    url: '/api/user/downloadTemplate',
    method: 'GET',
    params,
    responseType: 'blob'
  });
}
// 上传文件(使用upload插件自定义请求发送)
export function getupload(data) {
  return request({
    url: '/api/file/upload',
    method: 'POST',
    data
  });
}
// 将图片信息发送至服务器
export function changeupload(data) {
  return request({
    url: '/api/file/upload',
    method: 'POST',
    data
  });
}
// export function getUserInfo (params) {
//   return request({
//     url: 'api/user/getUserInfo',
//     method: 'GET',
//     params
//   });
// }
// export function login(data) {
//   return request({
//     url: 'api/base/login',
//     method: 'POST',
//     data
//   });
// }
