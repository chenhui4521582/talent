import request from '@/utils/request';

export interface IListItem {
  id: string;
  createTime: string;
  title: string;
  content?: string;
}

// 公告列表
export async function list(params) {
  return request(`/api/talent/announcement/listAll`, {
    method: 'POST',
    data: params,
  });
}

// 公告新增
export async function save(params) {
  return request(`/api/talent/announcement/save`, {
    method: 'POST',
    data: params,
  });
}

// 公告修改
export async function updateById(params) {
  return request(`/api/talent/announcement/updateInfo`, {
    method: 'POST',
    data: params,
  });
}

// 公告删除
export async function deleteById(params) {
  return request(`/api/talent/announcement/deleteById`, {
    method: 'POST',
    data: params,
  });
}

// 公告详情
export async function getInfoById(params) {
  return request(`/api/talent/announcement/getInfoById`, {
    method: 'POST',
    data: params,
  });
}
