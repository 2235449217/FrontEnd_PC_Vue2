import request from '@/utils/request';
// import {  } from '@/api/System/user';
export function getDeptList(data) {
  return request({
    url: 'api/department/lists',
    method: 'POST',
    data
  });
}
export function add(data) {
  return request({
    url: 'api/department/addDept',
    method: 'POST',
    data
  });
}
export function del(data) {
  return request({
    url: '/api/department/deleteDept',
    method: 'POST',
    data
  });
}
export function change(data) {
  return request({
    url: '/api/department/updateDept',
    method: 'POST',
    data
  });
}
export function getDept_users(params) {
  return request({
    url: '/api/department/users',
    method: 'GET',
    params
  });
}
