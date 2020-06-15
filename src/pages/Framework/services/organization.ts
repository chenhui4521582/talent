import request from '@/utils/request';

export interface tsSlectGroup {
  key: string;
  title: string;
}

export interface tsListItem {
  code: string;
  key?: string;
  title?: string;
  id?: number | null;
  level?: number;
  memberList?: tsUserItem[];
  name: string;
  parentCode?: string | null;
  children?: tsListItem[];
}

export interface tsUserItem {
  code: string;
  groupCode: string;
  name: string;
  key?: string;
  title?: string;
}

export interface tsDeleteItem {
  trueName: string;
  userCode: string;
}

export interface tsDefaultItem {
  trueName: string;
  userCode: string;
}

// 获取组织架构主体
export async function getOrganization() {
  return request(`/api/talent/department/listDefaultGroupMember`, {
    method: 'POST',
  });
}
// 获取已删除分组
export async function getDeleteGroup() {
  return request(`/api/talent/department/listDeletedDepartment`, {
    method: 'POST',
  });
}

// 获取默认分组
export async function getDefaultGroup() {
  return request(`/api/talent/departmentUser/listDefaultGroupMember`, {
    method: 'POST',
  });
}

// 删除分组
export async function deleteGroup() {
  return request(`/api/talent/department/delete`, {
    method: 'POST',
  });
}

// 新增分组
export async function newGroup() {
  return request(`/api/talent/department/save`, {
    method: 'POST',
  });
}

// 编辑分组
export async function editGroup() {
  return request(`/api/talent/department/update`, {
    method: 'POST',
  });
}

// 调整组的顺序
export async function editGroupSort() {
  return request(`/api/talent/department/update`, {
    method: 'POST',
  });
}
