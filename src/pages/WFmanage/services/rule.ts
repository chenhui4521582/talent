import request from '@/utils/request';
export interface tsList {}

// 获取工作流步骤
export async function roluList(id) {
  return request(`/api/talent/wfresapprstep/get`, {
    method: 'POST',
    data: { id },
  });
}

// 获取同一表单的审批工作流步骤 resApprovalId（表单id）
export async function roluFormList(resApprovalId) {
  return request(`/api/talent/wfresapprstep/list`, {
    method: 'POST',
    data: { resApprovalId },
  });
}

// 删除 (id)
export async function deleteRolu(id) {
  return request(`/api/talent/wfresapprstep/delete`, {
    method: 'POST',
    data: id,
  });
}

// 新增
export async function saveRolu(params) {
  return request(`/api/talent/wfresapprstep/save`, {
    method: 'POST',
    data: params,
  });
}

// 修改更新
export async function updateRolu(params) {
  return request(`/api/talent/wfresapprstep/update`, {
    method: 'POST',
    data: params,
  });
}

// 获取基础控件名称列表
export async function listSimple() {
  return request(`/api/talent/wfresbasecontrol/listSimple`, {
    method: 'POST',
  });
}
