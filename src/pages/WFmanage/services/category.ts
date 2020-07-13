import request from '@/utils/request';
export interface tsCategory {
  id: number;
  name: string;
  sort: number;
  listForm: tsCategoryItem[];
}

export interface tsCategoryItem {
  id: number;
  icon: string | null;
  name: string;
}

//获取工作流类别列表
export async function categoryList() {
  return request(`/api/talent/wfResFormCategory/getCategoryList`, {
    method: 'POST',
  });
}
// 删除
export async function deleteCategory(id: string) {
  return request(`/api/talent/wfResFormCategory/delete`, {
    method: 'POST',
    data: { id },
  });
}
// 新增
export async function saveCategory(name: string, remark: string) {
  return request(`/api/talent/wfResFormCategory/save`, {
    method: 'POST',
    data: { name, remark },
  });
}
// 修改
export async function updateCategory(id: string, name: string, remark: string) {
  return request(`/api/talent/wfResFormCategory/update`, {
    method: 'POST',
    data: { name, remark, id },
  });
}
