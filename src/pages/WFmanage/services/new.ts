import request from '@/utils/request';

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

// 获取工作流列表
export async function homeList() {
  return request(`/api/talent/wfresform/getList`, {
    method: 'POST',
  });
}

// 工作流状态
export async function changeState(id) {
  return request(`/api/talent/wfresform/updateStatus`, {
    method: 'POST',
    data: { id },
  });
}

// 新增工作流
export async function save(params) {
  return request(`/api/talent/wfresform/save`, {
    method: 'POST',
    data: params,
  });
}

// 修改工作流
export async function changeWf(params: tsCategoryItem) {
  return request(`/api/talent/wfresform/update`, {
    method: 'POST',
    data: params,
  });
}
