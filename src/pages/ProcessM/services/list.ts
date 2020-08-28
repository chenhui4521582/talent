import request from '@/utils/request';
export async function save(params) {
  // 流程干预提交
  return request(`/api/talent/wftaskform/interveneTaskForm`, {
    method: 'POST',
    data: params,
  });
}

export async function getRuleList(id) {
  // 规则节点列表
  return request(`/api/talent/wftaskform/getStepListByTaskFromId`, {
    method: 'POST',
    data: { id },
  });
}
