import request from '@/utils/request';

export async function queryEntry(params) {
  return request('/api/talent/evaluation/listInterview', {
    method: 'POST',
    data: params
  });
}

// 入职
export async function entryJob(params) {
  return request('/api/talent/evaluation/updateResumeInterview', {
    method: 'POST',
    data: params
  });
}