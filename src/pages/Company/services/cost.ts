import request from '@/utils/request';

interface lsitParam {
  pageNum: number;
  pageSize: number;
}

export async function listPage(params: lsitParam) {
  // 成本中心列表
  return request(`/api/talent/costCenter/list`, {
    method: 'POST',
    data: params,
  });
}

export async function saveCost(params) {
  // 新增成本
  return request(`/api/talent/costCenter/save`, {
    method: 'POST',
    data: params,
  });
}

export async function updateCost(params) {
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
