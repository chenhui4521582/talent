import request from '@/utils/request';

export interface IMyDemand {
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
// hr被分配的需求
export async function queryMyDemand(params) {
  return request('/api/talent/demand/listMyUploadDemand', {
    method: 'POST',
    data: params,
  });
}
