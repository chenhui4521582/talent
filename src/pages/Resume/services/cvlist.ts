import request from '@/utils/request';

export async function queryResume(params) { // 我的简历
  return request(`/api/talent/resume/listResumePage`, {
    method: 'POST',
    data: params
  })
};