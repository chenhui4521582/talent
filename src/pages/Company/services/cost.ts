import request from '@/utils/request';
import { PaginationTableParams } from '@/types/ITypes';

export interface tsCostColItem {
  costCenterName: string;
  createTime: string;
  updateTime: string;
  id: number;
  action: string;
}

export interface tsCostSave {
  costId?: number;
  companyId: number;
}

export async function listPage(params: PaginationTableParams) {
  // 成本中心列表
  return request(`/api/talent/costCenter/list`, {
    method: 'POST',
    data: params,
  });
}

export async function saveCost(params: tsCostSave) {
  // 新增成本
  return request(`/api/talent/costCenter/save`, {
    method: 'POST',
    data: params,
  });
}

export async function updateCost(params: tsCostSave) {
  // 编辑成本
  return request(`/api/talent/costCenter/update`, {
    method: 'POST',
    data: params,
  });
}

export async function removeCost(costId: number) {
  // 删除成本
  return request(`/api/talent/costCenter/delete`, {
    method: 'POST',
    data: { costId },
  });
}
