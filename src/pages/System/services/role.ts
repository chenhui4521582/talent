import request from '@/utils/request';

// 获取不同角色的人员, hr: 1, msg: 2
export async function getRoleList(params) {
  return request(`/api/talent/role/listRole`, {
    method: 'POST',
    data: params
  })
}

export async function updateRole(roleId: string, status: string) { // 修改hr状态
  return request(`/api/talent/role/updateRole`, {
    method: 'POST',
    data: { roleId, status }
  })
}

export async function addRole(params) { // 新增面试官或Hr
  return request(`/api/talent/role/addRole`, {
    method: 'POST',
    data: params
  })
}