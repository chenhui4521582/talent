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
}

export interface tsGroupList {
  id: number;
  allowMultiple: number;
  createTime: string | null;
  createdBy: string | null;
  name: string | null;
  resFormId: number;
  showType: number | null;
  status: number | null;
  updateTime: string | null;
  updatedBy: string | null;
  list?: any;
}

export interface tsControlList {
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
  sort: number | null;
  updateTime: string | null;
  updatedBy: string | null;
  resGroupId: number;
  isGroups?: number;
}

//工作流动态表单详情
export async function wfFormDetail(accountType: number, id: number) {
  return request(`/api/talent/wfresform/getDetail`, {
    method: 'POST',
    data: {
      accountType,
      id,
    },
  });
}

export interface PaginationTableParams {
  pageNum: number;
  pageSize: number;
  [propName: string]: any;
}

export async function listPage(params: PaginationTableParams) {
  // 成本中心列表
  return request(`/api/talent/laborRelation/list`, {
    method: 'POST',
    data: params,
  });
}
