import request from '@/utils/request';

// 【审批组件】获取表单数据接口
export function getFormDatas(id) {
  return request({
    url: 'api/record/data',
    method: 'get',
    params: {
      recordId: id
    }
  });
}
// 【审批组件】获取流程动态数据接口
export function getProcessDynamiceDatas(id) {
  return request({
    url: 'api/task/dynamic',
    method: 'get',
    params: {
      recordId: id
    }
  });
}

// 提交表单的接口
export function formSubmission() {
  return request({
    url: 'api/record/submit',
    method: 'post',
    data: {
      appId: 1,
      form: ''
    }
  });
}

// 【表单拖拽】保存接口
export function formExit(id, formData) {
  return request({
    url: 'api/app/form',
    method: 'post',
    data: {
      appId: id,
      form: formData
    }
  });
}

// 点击应用返回一个空表单的接口
export function getEmptyForm(id) {
  return request({
    url: 'api/app/empty',
    method: 'get',
    params: {
      appId: id
    }
  });
}

// 返回部门和成员的接口
export function getDepartmentsAndUsers() {
  return request({
    url: 'api/department/users/PC',
    method: 'post',
    data: {
      ID: 1
    }
  });
}
