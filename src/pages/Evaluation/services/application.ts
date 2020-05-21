import request from '@/utils/request';

// 应聘登记表
export async function listRegister(params) {
  return request('/api/talent/registerApplicationBase/admin/listRegister', {
    method: 'POST',
    data: params
  });
}

// 打印应聘登记表
export async function downloadRegisterPDFyp(params) {
  return request('/api/talent/registerApplicationBase/admin/downloadRegisterPDF', {
    method: 'POST',
    data: params
  });
}

// 打印员工登记表
export async function downloadRegisterPDF(params) {
  return request('/api/talent/registerStaff/admin/downloadRegisterPDF', {
    method: 'POST',
    data: params
  });
}

// 应聘登记表详情
export async function listRegisterDetail(resumeId: string) {
  return request('/api/talent/registerApplicationBase/admin/listRegisterDetail', {
    method: 'POST',
    data: { req: resumeId }
  });
}

// 编辑应聘登记表
export async function updateRegisterDetail(params) {
  return request('/api/talent/registerApplicationBase/admin/updateRegisterDetail', {
    method: 'POST',
    data: params
  });
}
