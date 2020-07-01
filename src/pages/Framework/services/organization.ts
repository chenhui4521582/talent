import request from '@/utils/request';

export interface tsSlectGroup {
  key: string;
  title: string;
  id: number;
  parentCode: string;
  children?: tsListItem[];
  memberList?: tsUserItem[];
}

export interface tsListItem {
  code: string;
  key?: string;
  title?: string;
  id: number;
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
  userType?: string | number;
  parentCode?: string | null;
}

export interface tsDeleteItem {
  trueName: string;
  userCode: string;
  parentCode?: string | null;
}

export interface tsDefaultItem {
  trueName: string;
  userCode: string;
}

export interface tsNewParam {
  id?: number;
  name: string;
  businessCode?: string;
  status: number;
  parentCode?: string;
  leaderCode?: string;
}
export interface refItem {
  type: string;
  key: string;
  title: string;
}
export interface tsRefs {
  getvalue: () => refItem[];
}

// 获取组织架构主体
export async function getOrganization() {
  return request(`/api/talent/department/listOrganization`, {
    method: 'POST',
  });
}

// 获取已删除分组
export async function getDeleteGroup() {
  return request(`/api/talent/departmentUser/listDeletedDepartmentUser`, {
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
export async function deleteGroup(id?: number) {
  return request(`/api/talent/department/delete`, {
    method: 'POST',
    data: { id },
  });
}

// 新增分组
export async function newGroup(param: tsNewParam) {
  return request(`/api/talent/department/save`, {
    method: 'POST',
    data: param,
  });
}

// 编辑分组
export async function editGroup(param: tsNewParam) {
  return request(`/api/talent/department/update`, {
    method: 'POST',
    data: param,
  });
}

// 调整组的顺序
export async function editGroupSort() {
  return request(`/api/talent/department/update`, {
    method: 'POST',
  });
}

// 批量删除人员
export async function deleteUserApi(userCode: string) {
  return request(`/api/talent/departmentUser/removeUserToDeleteGroupBatch`, {
    method: 'POST',
    data: {
      userCode,
    },
  });
}

//批量移入
export async function moveInUser(groupCode: string, userCode: string) {
  return request(`/api/talent/departmentUser/updateUserGroupBatch`, {
    method: 'POST',
    data: {
      groupCode,
      userCode,
    },
  });
}

// 设置部门负责人
export async function setDepartLeader(leaderCode: string, code: string) {
  return request(`/api/talent/department/updateLeader`, {
    method: 'POST',
    data: {
      leaderCode,
      code,
    },
  });
}

//设置人员上级
export async function setUserParent(
  departmentCode: string,
  userCode: string,
  parentCode: string,
) {
  return request(`/api/talent/departmentUser/updateUserParent`, {
    method: 'POST',
    data: {
      departmentCode,
      userCode,
      parentCode,
    },
  });
}
