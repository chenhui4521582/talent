import request from '@/utils/request';

// 员工登记表
export async function listRegisterStaff(params) {
  return request('/api/talent/registerStaff/admin/listRegisterStaff', {
    method: 'POST',
    data: params
  });
}

// 员工登记表详情
export async function commonDetail(params) {
  return request('/api/talent/registerStaff/admin/commonDetail', {
    method: 'POST',
    data: params
  });
}

// 编辑员工登记表
export async function commonUpdate(params) {
  return request('/api/talent/registerStaff/admin/commonUpdate', {
    method: 'POST',
    data: params
  });
}