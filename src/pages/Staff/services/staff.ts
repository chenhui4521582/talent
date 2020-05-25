import request from '@/utils/request';

// 花名册列表
export async function listByConditionsRoster(params) {
  return request('/api/talent/employeeRoster/listByConditionsRoster', {
    method: 'POST',
    data: params
  });
}

export async function importRoster(params) {
  let filedata = new FormData();
  if(params.files){
    filedata.append('files',params.files);
  }
  for (let item in params) {
    if(item !== 'files' && params[item]){
      filedata.append(item, params[item]);
    }
  }
  return request('/api/talent/employeeRoster/upload', {
    method: 'post',
    data: filedata
  });
}

export async function getconfigRoster() { // 查询花名册配置
  return request(`/api/talent/configureRoster/getByEmployeeId`, {
    method: 'POST',
    data: {}
  })
}

export async function saveConfigureRoster(params) { // 花名册配置
  return request(`/api/talent/configureRoster/saveConfigureRoster`, {
    method: 'POST',
    data: params
  })
}

export async function listFamily(params) { // 员工家庭信息列表
  return request(`/api/talent/employeeRoster/listFamily`, {
    method: 'POST',
    data: params
  })
}

export async function exportFamily(params) { // 导出员工家庭信息列表
  return request(`/api/talent/employeeRoster/exportFamily`, {
    method: 'get',
    params
  })
}

export async function commonDetail(employeeId: string) { // 详情
  return request('/api/talent/employeeRoster/getByEmployeeId', {
    method: 'POST',
    data: { employeeId }
  });
}