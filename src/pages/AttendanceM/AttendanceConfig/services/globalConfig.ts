import request from '@/utils/request';

// 规则列表
export async function ruleList(param) {
  return request(`/api/attendance/rule/listRule`, {
    method: 'POST',
    data: param,
  });
}

// 获取全局配置详情
export async function getGlobalConfig() {
  return request(`/api/attendance/globalConfig/getGlobalConfig`, {
    method: 'POST',
  });
}

// 修改全局配置
export async function upGlobalConfig(params) {
  return request(`/api/attendance/globalConfig/updateGlobalConfig`, {
    method: 'POST',
    data: params,
  });
}

// 查看节假日配置
export async function listHoliday(month) {
  return request(`/api/attendance/globalConfig/listHoliday`, {
    method: 'POST',
    data: { month },
  });
}

// 删除节日配置
export async function removeHoliday(holidayId) {
  return request(`/api/attendance/globalConfig/removeHoliday`, {
    method: 'POST',
    data: { holidayId },
  });
}

// 新增节日配置
export async function addHoliday(params) {
  return request(`/api/attendance/globalConfig/addHoliday`, {
    method: 'POST',
    data: params,
  });
}

// 编辑节日配置
export async function updateHoliday(params) {
  return request(`/api/attendance/globalConfig/updateHoliday`, {
    method: 'POST',
    data: params,
  });
}

// 假期管理列表
export async function listHolidayConfig(params) {
  return request(`/api/attendance/holidayConfig/listHolidayConfig`, {
    method: 'POST',
    data: params,
  });
}

// 编辑假日管理
export async function updateHolidayConfig(params) {
  return request(`/api/attendance/holidayConfig/updateHolidayConfig`, {
    method: 'POST',
    data: params,
  });
}

// 统一扣假管理列表
export async function listVacationRecord(params) {
  return request(`/api/attendance/vacation/listVacationRecord`, {
    method: 'POST',
    data: params,
  });
}

// 发起扣假
export async function saveVacationRecord(params) {
  return request(`/api/attendance//vacation/saveVacationRecord`, {
    method: 'POST',
    data: params,
  });
}
