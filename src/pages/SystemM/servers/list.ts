import request from '@/utils/request';

export interface tsItem {
  id: string;
  postName: string;
  employeeId: string;
  name: string;
  firstBusinessName: string;
  businessName: string;
  departmentName: string;
  groupName: string;
  sex: string;
  roleName: string;
  userCode: string;
  roleCode: string;
}

interface tsParams {
  businessCode?: string;
  employeeId?: string;
  name?: string;
  pageNum: string;
  pageSize: number;
}

// 人员列表
export async function list(params: tsParams) {
  return request('/api/talent/role/listUserRole', {
    method: 'POST',
    data: params,
  });
}

// 权限列表
export async function roleList() {
  return request('/api/talent/role/listTalentRole', {
    method: 'POST',
  });
}

// 授权
export async function updata(params) {
  return request('/api/talent/role/authorize', {
    method: 'POST',
    data: params,
  });
}
