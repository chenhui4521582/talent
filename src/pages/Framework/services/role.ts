import request from '@/utils/request';

// 获取标签列表
export async function getLableList() {
  return request(`/api/talent/wfresapprlabel/listAll`, {
    method: 'POST',
  });
}

// 标签删除
export async function deleteLable(id: number) {
  return request(`/api/talent/wfresapprlabel/delete`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 标签新增
export async function newLable(param: tsEditLable) {
  return request(`/api/talent/wfresapprlabel/saveLabel`, {
    method: 'POST',
    data: param,
  });
}

interface tsEditLable {
  id: number;
  labelName: string;
}

// 标签修改
export async function editLable(param: tsEditLable) {
  return request(`/api/talent/wfresapprlabel/update`, {
    method: 'POST',
    data: param,
  });
}

// 获取标签下的成员
export async function getLableMemberList(labelId: number) {
  return request(`/api/talent/wfresapprlabelmember/list`, {
    method: 'POST',
    data: {
      labelId,
    },
  });
}

export interface tsUser {
  department: string;
  departmentCode: string;
  id: number;
  labelId: null | number;
  memberType: number;
  name: string;
  userCode?: string;
  key?: number;
}

// 标签成员批量删除
export async function deleteBatchLabelmember(param: tsUser[]) {
  return request(`/api/talent/wfresapprlabelmember/deleteBatch`, {
    method: 'POST',
    data: param,
  });
}

// 批量新增 1:用户;2:部门
interface tsNewMember {
  labelId: number;
  memberType: number;
  userCode?: string;
  departmentCode?: string;
}
export async function newBatchLabelmember(param: tsNewMember) {
  return request(`/api/talent/wfresapprlabelmember/saveBatch`, {
    method: 'POST',
    data: param,
  });
}
