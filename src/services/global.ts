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

export interface IDepartment {
  code: string;
  name: string;
}

export interface IRank {
  rankId: number;
  rankName: string;
}

export interface ITitle {
  titleId: number;
  titleName: string;
}

export interface ICost {
  id: number;
  costCenterName: string;
}

export interface ILabor {
  id: number;
  laborRelationName: string;
}

export interface IResumeCompany {
  companyId: number;
  companyName: string | null;
  createTime: string | null;
  updateTime: string | null;
}

export interface tsListItem {
  code: string;
  key?: string;
  title?: string;
  id: number;
  level?: number;
  memberList?: tsUserItem[];
  name: string;
  parentCode?: string | null;
  children?: tsListItem[];
}

export interface tsUserItem {
  code: string;
  groupCode: string;
  name: string;
  key?: string;
  title?: string;
  userType?: string | number;
  parentCode?: string | null;
}

export interface tsDeleteItem {
  trueName: string;
  userCode: string;
  parentCode?: string | null;
}

export interface tsDefaultItem {
  trueName: string;
  userCode: string;
}

export async function queryMenus(data: MenusReqParams) {
  return request('/api/odsApi/resource/listMenuByRoleCode', {
    method: 'post',
    data,
  });
}

export async function queryCurrent() {
  return request(`/api/odsApi/user/getCurrentUser`);
}

export async function queryBusiness() {
  return request(`/api/odsApi/business/listBusinessLineOption`, {
    method: 'POST',
    data: {},
  });
}

export async function queryJob() {
  return request(`/api/talent/job/listJobOption`, {
    method: 'POST',
    data: {},
  });
}

// 获取面试官或hr列表 type: 1是hr， 2是面试官
export async function queryRole(type: number) {
  return request('/api/talent/role/listAllRole', {
    method: 'POST',
    data: { type },
  });
}

export async function updateUserInfo(params: IChangeUserInfoParams) {
  return request('/api/odsApi/user/updateUserInfo', {
    method: 'POST',
    data: params,
  });
}

export async function changeOwnPwd(params: IChangePwdParams) {
  return request('/api/odsApi/login/modifyPassword', {
    method: 'POST',
    data: params,
  });
}

export async function listUserByBusinessCode(businessId: number) {
  // 根据业务线id获取人员
  return request(`/api/talent/role/listUserByBusinessCode`, {
    method: 'POST',
    data: { businessId },
  });
}

// 部门下拉 1: 一级业务线  2: 二级业务线  3:部门  4:组别
export async function listDepartment(level: number) {
  return request(`/api/talent/employeeRoster/listDepartment`, {
    method: 'POST',
    data: { level },
  });
}

// 职级下拉
export async function listRank() {
  return request(`/api/talent/employeeRoster/listRank`, {
    method: 'POST',
    data: {},
  });
}

// 职位下拉
export async function listTitle() {
  return request(`/api/talent/employeeRoster/listTitle`, {
    method: 'POST',
    data: {},
  });
}

// 成本中心下拉
export async function listCostCenter() {
  return request(`/api/talent/costCenter/listOption`, {
    method: 'POST',
    data: {},
  });
}

// 劳动关系下拉
export async function listLabor() {
  return request(`/api/talent/laborRelation/listOption`, {
    method: 'POST',
    data: {},
  });
}

// 公司列表
export async function listCompany() {
  return request(`/api/talent/company/listCompanyOption`, {
    method: 'POST',
  });
}

// 获取组织架构主体
export async function getOrganization() {
  return request(`/api/talent/department/listOrganization`, {
    method: 'POST',
  });
}

// 获取已删除分组
export async function getDeleteGroup() {
  return request(`/api/talent/departmentUser/listDeletedDepartmentUser`, {
    method: 'POST',
  });
}

// 获取默认分组
export async function getDefaultGroup() {
  return request(`/api/talent/departmentUser/listDefaultGroupMember`, {
    method: 'POST',
  });
}
