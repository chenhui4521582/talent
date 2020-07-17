import request from '@/utils/request';

export interface IDemandParams {
  demandId: number;
  businessLineName: string;
  jobName: string;
  amount: number;
  actualAmount: number;
  emergencyDegree: number;
  hrName: string;
  entryDate: string;
  status: number;
  createTime: string;
}

export interface IDemandDetail {
  demandId: number;
  businessLineName: string;
  jobName: string;
  rank: string;
  amount: number;
  actualAmount: number;
  emergencyDegree: number;
  hrName: string;
  entryDate: string;
  status: number;
  createTime: string;
  interview: string;
  entryName: string;
  description: string;
}

export interface INewDemandParams {
  amount: number;
  businessCode: string;
  description: string;
  emergencyDegree: number;
  entryDate: string;
  interviewCode: string;
  positionId: number;
  rank: string;
}

//新增需求
export async function createDemand(params: INewDemandParams) {
  return request('/api/talent/demand/saveDemand', {
    method: 'POST',
    data: params,
  });
}

// 编辑需求
export async function updateDemand(params) {
  return request('/api/talent/demand/updateDemand', {
    method: 'POST',
    data: params,
  });
}

// 需求列表
export async function queryDemand(params) {
  return request('/api/talent/demand/listAllDemand', {
    method: 'POST',
    data: params,
  });
}

// 关闭需求
export async function closeDemand(demandId: number) {
  return request('/api/talent/demand/closeDemand', {
    method: 'POST',
    data: { demandId },
  });
}

// 需求详情
export async function demandDetail(demandId: number) {
  return request('/api/talent/demand/getDemandDetail', {
    method: 'POST',
    data: { demandId },
  });
}

export async function deleteDemand(demandId: number) {
  return request('/api/talent/demand/removeDemand', {
    method: 'POST',
    data: { demandId },
  });
}

export async function giveDemand(params) {
  return request('/api/talent/demand/distributeDemand', {
    method: 'POST',
    data: params,
  });
}
