import request from '@/utils/request';
// import {  } from '@/api/Task/task';
// 我的代办
export function todo (params) {
  return request({
    url: '/api/task/schedule',
    method: 'get',
    params
  });
}
// 我发起的
export function create (params) {
  return request({
    url: '/api/record/initiated',
    method: 'get',
    params
  });
}
// 我处理的
export function transactors (params) {
  return request({
    url: '/api/task/handle',
    method: 'get',
    params
  });
}
// 我收到的 抄送我的
export function ccusers (params) {
  return request({
    url: '/api/task/receive',
    method: 'get',
    params
  });
}

// 我收到的 抄送我的
export function todoNum () {
  return request({
    url: '/api/task/scheduleNum',
    method: 'get'
  });
}
