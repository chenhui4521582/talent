import request from '@/utils/request';

export interface IControls {
  id: string;
  type: string;
  name: string;
  parentType: string;
  isGroup: 0 | 1;
}

export enum ItemTypes {
  FormBox = 'formBox',
}

export interface IForm {
  columnNum: number;
  list: IGroupItem[];
  name: string;
  sort: number;
  id: number;
  type: 0 | 1 | 2;
  resFormId: string;
}

export interface IGroupItem {
  id: number;
  name: string;
  list: IItem[];
  colspan: number;
  isRequired: boolean;
  itemList?: string;
  baseControlType?: string;
}

export interface IItem {
  id: number;
  colspan: number;
  itemList: string;
  name: string;
  resGroupId: number;
  defaultShowValue: string;
  defaultValue: string;
  isRequired: boolean;
  baseControlType: string;
  isMultiplechoice: Boolean;
  isLocked: Boolean;
}

// 获取form表单
export async function getFormDetail(id) {
  return request(`/api/talent/wfresform/getDetail`, {
    method: 'POST',
    data: { id },
  });
}

// 获取所有的控件
export async function getControls() {
  return request(`/api/talent/wfresbasecontrol/list`, {
    method: 'POST',
  });
}

// 组的删除
export async function deleteGroup(resFormId, id) {
  return request(`/api/talent/wfresformgroup/delete`, {
    method: 'POST',
    data: {
      resFormId,
      id,
    },
  });
}

// 新增组
export async function saveGroup(resFormId, name) {
  return request(`/api/talent/wfresformgroup/save`, {
    method: 'POST',
    data: {
      name,
      resFormId,
    },
  });
}

// 修改组
export async function updateGroup(resFormId, id, name) {
  return request(`/api/talent/wfresformgroup/update`, {
    method: 'POST',
    data: {
      name,
      id,
      resFormId,
    },
  });
}

// 设置表单
export async function updateForm(data) {
  return request(`/api/talent/wfresformcontrol/updateControls`, {
    method: 'POST',
    data: data,
  });
}

// 删除子表单
export async function deleteCForm(resFormId, id) {
  return request(`/api/talent/wfresformchild/delete`, {
    method: 'POST',
    data: { resFormId, id },
  });
}

// 获取子表单
export async function getCForm(id) {
  return request(`/api/talent/wfresformchild/get`, {
    method: 'POST',
    data: { id },
  });
}

// 新增子表单
export async function saveCForm(resFormId, name, columnNum, type) {
  return request(`/api/talent/wfresformchild/save`, {
    method: 'POST',
    data: {
      resFormId,
      name,
      columnNum,
      type,
    },
  });
}

// 更新子表单
export async function updateCForm(resFormId, id, name, columnNum, type) {
  return request(`/api/talent/wfresformchild/update`, {
    method: 'POST',
    data: {
      resFormId,
      id,
      name,
      columnNum,
      type,
    },
  });
}
// 更换子表单位置
export async function updateSort(id1, id2) {
  return request(`/api/talent/wfresformchild/updateSort`, {
    method: 'POST',
    data: {
      id1,
      id2,
    },
  });
}
