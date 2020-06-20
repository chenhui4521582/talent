import request from '@/utils/request';
import { tsGroupList, tsFormChildlist } from './home';

export interface tsDetail {
  applyTruename: string;
  createTime: string;
  createdBy: string;
  formNumber: string;
  id: number;
  name: string;
  resFormId: number;
  title: string;
  formChildlist: tsFormChildlist[];
  groupList: tsGroupList[];
}

export interface tsLog {
  apprRemark: string;
  apprStatus: number;
  apprUserCode: string | null;
  apprUserTruename: string;
  departmentName: string;
  groupName: string | null;
  nextStepUserCodes: string | null;
  nextStepUserNames: string | null;
  taskApprStepId: number;
  key: number;
}

// 工作流撤回接口
export async function detailCanceled(id: number) {
  return request(`/api/talent/wftaskform/canceled`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 表单详情
export async function getDetail(id: number) {
  return request(`/api/talent/wftaskform/getDetail`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 查询按钮权限
export async function getButtonStatus(taskFormId: number) {
  return request(`/api/talent/wftaskapprstep/queryButtonPermission`, {
    method: 'POST',
    data: {
      taskFormId,
    },
  });
}

// 查看流转历史记录
export async function gefLogList(taskFormId: number) {
  return request(`/api/talent/wftaskapprstep/queryWfLogList`, {
    method: 'POST',
    data: {
      taskFormId,
    },
  });
}

// 提交按钮 1.通过，2驳回 3申请人提交
export function submit(params: any) {
  return request(`/api/talent/wftaskform/processTaskForm`, {
    method: 'POST',
    data: params,
  });
}
