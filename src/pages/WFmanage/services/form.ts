import request from '@/utils/request';

export interface IControls {
  id: string;
  type: string;
  name: string;
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
  formType: 'group' | 'item';
}

export interface IGroupItem {
  id: number;
  name: string;
  list: IItem[];
  colspan: number;
  isRequired: boolean;
  itemList?: string;
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

// 设置表单
