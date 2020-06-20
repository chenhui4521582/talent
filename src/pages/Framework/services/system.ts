import request from '@/utils/request';

// 获取标签列表
export async function getLableList() {
  return request(`/api/talent/wfresapprsyslabel/listAll`, {
    method: 'POST',
  });
}

// 删除
export async function deleteLable(id?: number) {
  return request(`/api/talent/wfresapprsyslabel/delete`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 获取工作流系统标签详情
export async function getLableMemberList(labelId: number) {
  return request(`/api/talent/wfresapprsyslabel/get`, {
    method: 'POST',
    data: {
      id: labelId,
    },
  });
}

// 新增
export async function newLable(labelName: string) {
  return request(`/api/talent/wfresapprsyslabel/savesysLabel`, {
    method: 'POST',
    data: {
      labelName,
    },
  });
}

// 编辑系统标签
export async function editLable(param) {
  return request(`/api/talent/wfresapprsyslabel/update`, {
    method: 'POST',
    data: param,
  });
}

// 修改名称
export async function changeNameLable(param) {
  return request(`/api/talent/wfresapprsyslabel/updateLabelName`, {
    method: 'POST',
    data: param,
  });
}
