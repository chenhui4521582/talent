import request from '@/utils/request';

// 规则列表
export async function ruleList(param) {
  return request(`/api/attendance/rule/listRule`, {
    method: 'POST',
    data: param,
  });
}

// 新增规则
export async function saveRule(param) {
  return request(`/api/attendance/rule/saveRule`, {
    method: 'POST',
    data: param,
  });
}

// 编辑
export async function updateRule(param) {
  return request(`/api/attendance/rule/updateRule`, {
    method: 'POST',
    data: param,
  });
}

// 规则详情
export async function getRuleDetail(ruleId: number) {
  return request(`/api/attendance/rule/getRuleDetail`, {
    method: 'POST',
    data: { ruleId },
  });
}

// 删除规则
export async function deleteRule(ruleId: number) {
  return request(`/api/attendance/rule/deleteRule`, {
    method: 'POST',
    data: { ruleId },
  });
}
