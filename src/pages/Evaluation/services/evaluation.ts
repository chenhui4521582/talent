import request from '@/utils/request';

// hr的面试列表
export async function queryHrList(params) {
  return request('/api/talent/evaluation/listInterviewByHr', {
    method: 'POST',
    data: params
  });
}

// 管理员面试列表
export async function queryList(params) {
  return request('/api/talent/evaluation/listAllInterview', {
    method: 'POST',
    data: params
  });
}

// 填写入职反馈
export async function writeBack(params) {
  return request('/api/talent/evaluation/updateInterviewByHr', {
    method: 'POST',
    data: params
  });
}