import request from '@/utils/request';
import { PaginationTableParams } from '@/types/ITypes';

export interface tsLabourColItem {
  laborRelationName: string;
  createTime: string;
  updateTime: string;
  id: number;
  action: string;
}

export interface tsLabourSave {
  laborId?: number;
  laborRelationName: string;
}

export async function listPage(params: PaginationTableParams) {
  // 成本中心列表
  return request(`/api/talent/laborRelation/list`, {
    method: 'POST',
    data: params,
  });
}

export async function saveLabour(params: tsLabourSave) {
  // 新增成本
  return request(`/api/talent/laborRelation/save`, {
    method: 'POST',
    data: params,
  });
}

export async function updateLabour(params: tsLabourSave) {
  // 编辑成本
  return request(`/api/talent/laborRelation/update`, {
    method: 'POST',
    data: params,
  });
}

export async function removeLabour(laborId: number) {
  // 删除成本
  return request(`/api/talent/laborRelation/delete`, {
    method: 'POST',
    data: { laborId },
  });
}
