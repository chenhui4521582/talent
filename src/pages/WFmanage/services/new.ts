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

// 发起流程列表 /wfresform/list

export async function homeList() {
  return request(`/api/talent/wfresform/list`, {
    method: 'POST',
  });
}
