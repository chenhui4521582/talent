import request from '@/utils/request';

export interface tsWfFormDetail {
  columnNum: number;
  content: string | null;
  formCategoryId: number;
  icon: string | null;
  id: number;
  name: string | null;
  formChildlist: tsFormChildlist[];
  groupList: tsGroupList[];
}

export interface tsFormChildlist {
  id: number;
  columnNum: number;
  createTime: string | null;
  createdBy: string | null;
  name: string | null;
  resFormId: number;
  sort: number;
  status: number | null;
  updateTime: string | null;
  updatedBy: string | null;
  controlList: tsControlList[];
  list: tsGroupList[] | tsControlList[];
  type: number;
}

export interface tsGroupList {
  id: string;
  allowMultiple: number;
  createTime: string | null;
  createdBy: string | null;
  name: string | null;
  resFormId: number;
  showType: number | null;
  status: number | null;
  updateTime: string | null;
  updatedBy: string | null;
  list?: tsControlList[];
  resFormGroupId: string;
  sort?: number;
}

export interface tsControlList {
  icon?: string;
  allowModify: number | null;
  baseControlType: string;
  colspan: number;
  createTime: string | null;
  createdBy: string | null;
  defaultValue: string | null;
  dynamicParam: string | null;
  groupId: number;
  id: number;
  isCondition: number | null;
  isLocked: number | null;
  isMultiplechoice: number | null;
  isPrint: number | null;
  isRequired: number | null;
  itemList: any;
  modifyUserType: number | null;
  modifyUserValue: any;
  name: string | null;
  remark: string | null;
  resFormChildId: number | null;
  resFormId: number | null;
  rowspan: number | null;
  sort: number;
  updateTime: string | null;
  updatedBy: string | null;
  resGroupId: string;
  isGroups?: number;
}

export interface PaginationTableParams {
  pageNum: number;
  pageSize: number;
  [propName: string]: any;
}

export interface tsFormSaveItem {
  id: number;
  multipleNumber?: number;
  value: string;
}

export interface tsFormFiledSaveItem {
  fileExtname: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  id: number;
  resFormControlId: number;
  taskFormId: number;
}

export interface tsList {
  id: number;
  title: string;
  name: string;
  createTime: string;
  status: string;
  currStepName: string;
}

export interface tsCategory {
  id: number;
  name: string;
  sort: number;
  listForm: tsCategoryItem[];
}

export interface tsCategoryItem {
  id: number;
  icon: string | null;
  name: string;
}

//工作流动态表单详情
export async function wfFormDetail(id: number) {
  return request(`/api/talent/wfresform/getDetail`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

//提交流程表单
export async function saveTaskForm(params: any) {
  return request(`/api/talent/wftaskform/saveTaskForm`, {
    method: 'POST',
    data: params,
  });
}

// 我的列表
export async function myListPage(params: PaginationTableParams) {
  return request(`/api/talent/wftaskform/listMyFormPage`, {
    method: 'POST',
    data: params,
  });
}

// 已办列表
export async function myToDoListPage(params: PaginationTableParams) {
  return request(`/api/talent/wftaskform/listTodoFormPage`, {
    method: 'POST',
    data: params,
  });
}

// 我的待办
export async function myDoneListPage(params: PaginationTableParams) {
  return request(`/api/talent/wftaskform/listDoneFormPage`, {
    method: 'POST',
    data: params,
  });
}

// 发起流程列表 /wfresform/list

export async function homeList() {
  return request(`/api/talent/wfresform/list`, {
    method: 'POST',
  });
}

// 我的列表
export async function myListPageWt(params: PaginationTableParams) {
  return request(`/api/talent/wftaskform/listRelationFormPage`, {
    method: 'POST',
    data: params,
  });
}
