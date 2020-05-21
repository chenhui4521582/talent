import request from '@/utils/request';

export async function listInterviewByInterviewer(params) { // 面试列表
  return request(`/api/talent/interviewer/listInterviewByInterviewer`, {
    method: 'POST',
    data: params
  })
}

export async function updateInterviewByInterviewer(params) { // 面试官填写反馈
  return request(`/api/talent/interviewer/updateInterviewByInterviewer`, {
    method: 'POST',
    data: params
  })
}

// deal 0待筛选  1已筛选
export async function listEvaByInterviewer(params) { // 筛选简历列表
  return request(`/api/talent/interviewer/listEvaByInterviewer`, {
    method: 'POST',
    data: params
  })
}
// status 0驳回 1通过
export async function updateEvaluation(params) { // 通过、驳回
  return request(`/api/talent/interviewer/updateEvaluation`, {
    method: 'POST',
    data: params
  })
}