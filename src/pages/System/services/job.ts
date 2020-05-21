import request from '@/utils/request';

export async function listJobPage(params) { // 岗位列表
  return request(`/api/talent/job/listJobPage`, {
    method: 'POST',
    data: params
  })
}

export async function saveJob(params) { // 新增岗位
  return request(`/api/talent/job/saveJob`, {
    method: 'POST',
    data: params
  })
}
export async function updateJob(params) { // 编辑岗位
  return request(`/api/talent/job/updateJob`, {
    method: 'POST',
    data: params
  })
}

export async function removeJob(positionId: number) { // 删除岗位
  return request(`/api/talent/job/removeJob`, {
    method: 'POST',
    data: { positionId }
  })
}