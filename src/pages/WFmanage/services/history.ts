import request from '@/utils/request';
export interface tsList {
  applyDepartmentName: string;
  applyTruename: string;
  createTime: string;
  formNumber: string;
  id: string;
  name: string;
  status: string;
}

// 工作流历史记录列表
export async function historyList(params) {
  return request(`/api/talent/wftaskform/taskFormListByCondition`, {
    method: 'POST',
    data: params,
  });
}

// 删除历史记录
export async function deleteHistory(id: string) {
  return request(`/api/talent/wftaskform/deleteTaskForm`, {
    method: 'POST',
    data: { id },
  });
}
