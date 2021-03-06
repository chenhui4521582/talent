import request from '@/utils/request';
export interface tsList {}

export interface tsStepObj {
  noticeStatus: 1 | 2 | 3;
  stepModelList: tsStep[];
  controlModels?: any[];
}
export interface tsStep {
  ruleSets?: any;
  isCondition?: 1 | 0;
  nextNodeId?: number;
  id: string;
  stepName: string;
  stepType: number;
  type: number;
  nodeType: string;
  userCodeList: string;
  stepNumber: string;
  signType: number;
  labelId: number;
  resFormControlIds?: number[];
  sysLabelId?: string;
  relationResFormControlId?: string;
}

export enum ItemTypes {
  Card = 'card',
}

// 获取工作流步骤
export async function roluList(id) {
  return request(`/api/talent/wfresapprstep/get`, {
    method: 'POST',
    data: { id },
  });
}

// 获取同一表单的审批工作流步骤 resApprovalId（表单id）
export async function roluFormList(resApprovalId: number) {
  return request(`/api/talent/wfresapprstep/list`, {
    method: 'POST',
    data: { resApprovalId },
  });
}

// 删除 (id)
export async function deleteRolu(id) {
  return request(`/api/talent/wfresapprstep/delete`, {
    method: 'POST',
    data: id,
  });
}

// 新增
export async function saveRolu(params) {
  return request(`/api/talent/wfresapprstep/save`, {
    method: 'POST',
    data: params,
  });
}

// 修改更新
export async function updateRolu(params) {
  return request(`/api/talent/wfresapprstep/update`, {
    method: 'POST',
    data: params,
  });
}

// 获取基础控件名称列表
export async function listSimple() {
  return request(`/api/talent/wfresbasecontrol/listSimple`, {
    method: 'POST',
  });
}

//获取工作流表单的所有控件
export async function getFormSimple(resFormId: string) {
  return request(`/api/talent/wfresformcontrol/listByFormId`, {
    method: 'POST',
    data: { resFormId },
  });
}

// 换取审批流程的id
export async function getStepId(formId: number) {
  return request(`/api/talent/wfresapproval/list`, {
    method: 'POST',
    data: { formId },
  });
}

// 获取归档下拉
export async function getLableList() {
  return request(`/api/talent/wfresapprarchive/selectAll`, {
    method: 'POST',
  });
}

// 获取归档参数
export async function getParam(id) {
  return request(`/api/talent/wfresapprarchive/selectDemandControllerList`, {
    method: 'POST',
    data: { id },
  });
}

// 获取详情 （带条件审批）
export async function listWithCondition(resApprovalId) {
  return request(`/api/talent/wfresapprstep/listWithCondition`, {
    method: 'POST',
    data: { resApprovalId },
  });
}

// 保存（带条件审批）
export async function saveWithConditon(params) {
  return request(`/api/talent/wfresapprstep/saveWithConditon`, {
    method: 'POST',
    data: params,
  });
}

// 更新（带条件审批）
export async function updateWithCondition(params) {
  return request(`/api/talent/wfresapprstep/updateWithCondition`, {
    method: 'POST',
    data: params,
  });
}
