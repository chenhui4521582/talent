import request from '@/utils/request';

export interface IResumeTable {
  resumeId: string;
  userName: string;
  phone: string;
  jobLabel: string;
  resumeStatus: number;
  updateTime: string;
  status: number;
  demandId: number;
  note: string;
}

export interface IDeleteResume {
  resumeId: string;
  resumeStatus: string;
}

export interface IDemandParams {
  demandId: number;
  businessLineName: string;
  jobName: string;
}

export interface IChangeRecords {
  id: number;
  createTime: string;
  description: string;
}

export interface IUpdateResume {
  resumeId: string;
  demandId: number;
  status: number;
  interviewTime: string;
}

export async function queryMyResume(params) {
  // 我的简历
  return request(`/api/talent/resume/listMyResume`, {
    method: 'POST',
    data: params,
  });
}

export async function removeResume(params: IDeleteResume) {
  // 删除简历
  return request(`/api/talent/resume/removeResume`, {
    method: 'POST',
    data: params,
  });
}

export async function selectDemand() {
  // 所有进行中需求列表下拉框
  return request(`/api/talent/demand/listDemand`, {
    method: 'POST',
    data: {},
  });
}

export async function listResumeRecord(resumeId: string) {
  // 简历变更记录
  return request(`/api/talent/record/listResumeRecord`, {
    method: 'POST',
    data: { resumeId },
  });
}

export async function updateResumeStatus(params: IUpdateResume) {
  // 已下载简历状态变更
  return request(`/api/talent/resume/updateResumeStatus`, {
    method: 'POST',
    data: params,
  });
}

// 增加便签
export async function addNote(params) {
  return request('/api/talent/resume/addNote', {
    method: 'POST',
    data: params,
  });
}
