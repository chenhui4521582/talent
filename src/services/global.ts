import request from '@/utils/request';
import { MenuDataItem } from '@ant-design/pro-layout';

interface MenusReqParams {
  projectRoutes: string;
}

export interface IMenusparams {
  menuList: MenuDataItem[];
  projectName: string;
}

export interface ICurrentUserParams {
  businessCode: string;
  email: string;
  userName: string;
  phone: string;
}

export interface IBusiness {
  businessId: number;
  businessCode: string;
  businessLineName: string;
}

export interface IJob {
  jobId: number;
  jobName: string;
}

export interface IChangeUserInfoParams {
  userName: string;
  phone: string;
}

export interface IChangePwdParams {
  oldPassword: string;
  newPassword: string;
  confirm: string;
}

export interface IBusinessPerson {
  businessLineName: string;
  id: number;
  userCode: string;
  userName: string;
}

export async function queryMenus(data: MenusReqParams) {
  return request('/api/odsApi/resource/listMenuByRoleCode', {
    method: 'post',
    data
  });
};

export async function queryCurrent() {
  return request(`/api/odsApi/user/getCurrentUser`)
};

export async function queryBusiness() {
  return request(`/api/odsApi/business/listBusinessLineOption`, {
    method: 'POST',
    data: {}
  })
};

export async function queryJob() {
  return request(`/api/talent/job/listJobOption`, {
    method: 'POST',
    data: {}
  })
};

// 获取面试官或hr列表 type: 1是hr， 2是面试官
export async function queryRole(type: number) {
  return request('/api/talent/role/listAllRole', {
    method: 'POST',
    data: { type }
  });
}

export async function updateUserInfo(params: IChangeUserInfoParams) {
  return request('/api/odsApi/user/updateUserInfo', {
    method: 'POST',
    data: params
  });
};

export async function changeOwnPwd(params: IChangePwdParams) {
  return request('/api/odsApi/login/modifyPassword', {
    method: 'POST',
    data: params
  });
};

export async function listUserByBusinessCode(businessId: number) { // 根据业务线id获取人员
  return request(`/api/talent/role/listUserByBusinessCode`, {
    method: 'POST',
    data: { businessId }
  })
}