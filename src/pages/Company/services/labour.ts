import request from '@/utils/request';

interface lsitParam {
  pageNum: number;
  pageSize: number;
}

export async function listPage(params: lsitParam) {
  // 成本中心列表
  return request(`/api/talent/laborRelation/list`, {
    method: 'POST',
    data: params,
  });
}

export async function saveLabour(params) {
  // 新增成本
  return request(`/api/talent/laborRelation/save`, {
    method: 'POST',
    data: params,
  });
}

export async function updateLabour(params) {
  // 编辑成本
  return request(`/api/talent/laborRelation/update`, {
    method: 'POST',
    data: params,
  });
}

export async function removeLabour(labourId: number) {
  // 删除成本
  return request(`/api/talent/laborRelation/delete`, {
    method: 'POST',
    data: { labourId },
  });
}
