import request from '@/utils/request';

export interface IBoleTableItem {
  demandId: number;
  businessLineName: string;
  jobName: string;
  amount: number;
  actualAmount: number;
  boleLevel: number;
  boleReward: number;
  status: number;
  boleHireNumber: number;
  boleRecommendNumber: number;
  endTime: string;
  boleLink: string;
}

export interface IBoleHireItem {
  name: string;
  resumeLink: string;
  recommendName: string;
  status: number;
  entryDate: string;
}

// 设置伯乐奖
export async function setBole(params) {
  return request('/api/talent/demand/saveBoleReward', {
    method: 'POST',
    data: params
  });
}

// 管理员伯乐奖
export async function queryAdminBole(params) {
  return request('/api/talent/demand/listBoleByAdmin', {
    method: 'POST',
    data: params
  });
}

// hr伯乐奖
export async function queryHrBole(params) {
  return request('/api/talent/demand/listBoleByHr', {
    method: 'POST',
    data: params
  });
}

// 伯乐奖推荐录用情况
export async function queryBoleHire(demandId: number) {
  return request('/api/talent/demand/listBoleHire', {
    method: 'POST',
    data: { demandId }
  });
}

// 撤销伯乐奖
export async function removeBole(demandId: number) {
  return request('/api/talent/demand/removeBoleReward', {
    method: 'POST',
    data: { demandId }
  });
}