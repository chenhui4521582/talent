import request from '@/utils/request';

export interface IMyTask {
  demandId: number;
  businessLineName: string;
  jobName: string;
  amount: number;
  actualAmount: number;
  emergencyDegree: number;
  status: number;
  createTime: string;
}
// hr被分配的需求
export async function queryTask(params) {
  return request('/api/talent/demand/listMyDemand', {
    method: 'POST',
    data: params
  });
}