import request from '@/utils/request';

// 获取标签列表
export async function getLableList() {
  return request(`/api/talent/wfresapprarchive/listAll`, {
    method: 'POST',
  });
}

// 删除
export async function deleteLable(id?: number) {
  return request(`/api/talent/wfresapprarchive/delete`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

export interface tsLableItem {
  id: string;
  name: string;
  remark: string;
  url: string;
}

// 获取工作流系统标签详情
export async function getLableMemberList(labelId?: number) {
  return request(`/api/talent/wfresapprarchive/get`, {
    method: 'POST',
    data: {
      id: labelId,
    },
  });
}

// 新增
export async function editLable(param) {
  return request(`/api/talent/wfresapprarchive/saveOrUpdate`, {
    method: 'POST',
    data: param,
  });
}
