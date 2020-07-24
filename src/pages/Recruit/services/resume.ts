import request from '@/utils/request';

interface ISendResumeParams {
  downStatus: number;
  resumeIds: string;
  demandId: number;
}

// 获取我的需求简历 1未下载 2已下载
export async function queryDemandResume(params) {
  params.demandId = Number(window.location.pathname.split('/')[4]);
  return request('/api/talent/resume/listMyDemandResume', {
    method: 'POST',
    data: params,
  });
}

// 推送简历
export async function sendResume(params: ISendResumeParams) {
  return request('/api/talent/evaluation/insertEvaluation', {
    method: 'POST',
    data: params,
  });
}

// 已推送简历
export async function querySendedResume(params) {
  params.demandId = Number(window.location.pathname.split('/')[4]);
  return request('/api/talent/evaluation/listEvaluationByHr', {
    method: 'POST',
    data: params,
  });
}

//拒绝面试
export async function refuseEva(nId) {
  return request('/api/talent/evaluation/updateEva', {
    method: 'POST',
    data: { nId },
  });
}

//发起面试
export async function setInterview(params) {
  return request('/api/talent/evaluation/insertInterview', {
    method: 'POST',
    data: params,
  });
}

// 撤销简历
export async function revoke(evaluationId: number) {
  return request('/api/talent/evaluation/deleteEvaluation', {
    method: 'POST',
    data: { evaluationId },
  });
}
