import request from '@/utils/request';

// 获取标签列表
export async function getLableList() {
  return request(`/api/talent/wfresapprlabel/listAll`, {
    method: 'POST',
  });
}

// 标签删除
export async function deleteLable(id: number) {
  return request(`/api/talent/wfresapprlabel/delete`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 标签新增
export async function newLable(param: tsEditLable) {
  return request(`/api/talent/wfresapprlabel/saveLabel`, {
    method: 'POST',
    data: param,
  });
}

interface tsEditLable {
  id: number;
  labelName: string;
}

// 标签修改
export async function editLable(param: tsEditLable) {
  return request(`/api/talent/wfresapprlabel/update`, {
    method: 'POST',
    data: param,
  });
}

// 获取标签下的成员
export async function getLableMemberList(labelId: number) {
  return request(`/api/talent/wfresapprlabelmember/list`, {
    method: 'POST',
    data: {
      labelId,
    },
  });
}

//标签成员删除
// export async function deleteLabelmember(id:number) {
//   return request(`/api/talent/wfresapprlabelmember/delete`, {
//     method: 'POST',
//     data:{
//       id,
//     }
//   });
// }

// 标签成员批量删除
export async function deleteBatchLabelmember(id: number) {
  return request(`/api/talent/wfresapprlabelmember/deleteBatch`, {
    method: 'POST',
    data: {
      id,
    },
  });
}

// 新增
// export async function newLabelmember(labelId:number, memberType:number, userCode?:string, departmentCode?:string) {
//   return request(`/api/talent/wfresapprlabelmember/save`, {
//     method: 'POST',
//     data:{
//       labelId,
//       memberType,
//       userCode,
//       departmentCode
//     }
//   });
// }

// 批量新增 1:用户;2:部门
export async function newBatchLabelmember(
  labelId: number,
  memberType: number,
  userCode?: string,
  departmentCode?: string,
) {
  return request(`/api/talent/wfresapprlabelmember/saveBatch`, {
    method: 'POST',
    data: {
      labelId,
      memberType,
      userCode,
      departmentCode,
    },
  });
}
