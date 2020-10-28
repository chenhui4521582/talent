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
  apprTime: string;
  apprRemark: string;
  apprStatus: number;
  apprUserCode: string | null;
  apprUserTruename: string;
  departmentName: string;
  businessName: string;
  groupName: string | null;
  nextStepUserCodes: string | null;
  nextStepUserNames: string | null;
  taskApprStepId: number;
  key: number;
  stepName: string;
  stepNumber: number;
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

// 请假类型
export function listHoliday(params: any) {
  return request(`/api/talent/attendenceControl/listHoliday`, {
    method: 'POST',
    data: params,
  });
}

// 当月剩余不卡次数 taskFormId time type userCode
export function archiveReplaceCard(params: any) {
  return request(`/api/talent/attendenceControl/archiveReplaceCard`, {
    method: 'POST',
    data: params,
  });
}

// 出差/外出共计时长 outcheckTimeEnd  outcheckTimeStart
export function getOutCheckTime(params: any) {
  return request(`/api/talent/attendenceControl/getOutCheckTime`, {
    method: 'POST',
    data: params,
  });
}

// 请假校验接口endTime  startTime  type  typeId  userCode
export function listRelationFormPage(params: any) {
  return request(`/api/talent/attendenceControl/listRelationFormPage`, {
    method: 'POST',
    data: params,
  });
}

// 加班共计时长 overTimeEnd overTimeStart
export function overTime(params: any) {
  return request(`/api/talent/attendenceControl/overTime`, {
    method: 'POST',
    data: params,
  });
}

// 获取请假天数 userCode
export function getAvailableTime(params: any) {
  return request(`/api/talent/attendenceControl/getAvailableTime`, {
    method: 'POST',
    data: params,
  });
}

// 请假/销假共计时长计算 endTime startTime type typeId userCode
export function vacationTime(params: any) {
  return request(`/api/talent/attendenceControl/vacationTime`, {
    method: 'POST',
    data: params,
  });
}
