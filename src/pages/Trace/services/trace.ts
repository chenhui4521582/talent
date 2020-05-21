import request from '@/utils/request';

// type: 1面试通知管理   2录用通知管理
export async function querySmsReocrd(params) {
  return request('/api/talent/record/listSmsRecord', {
    method: 'POST',
    data: params
  });
}

// type: 1面试   2录用
export async function resendSms(params) {
  return request('/api/talent/evaluation/reSendSms', {
    method: 'POST',
    data: params
  });
}

export async function queryRuzhi(params) {
  return request('/api/talent/evaluation/listEmployed', {
    method: 'POST',
    data: params
  });
}

export async function queryActionRecord(id: number) {
  return request('/api/talent/record/listEntryRecord', {
    method: 'POST',
    data: { id }
  });
}

export async function updateStatus(params) {
  return request('/api/talent/evaluation/updateInterviewEntry', {
    method: 'POST',
    data: params
  });
}