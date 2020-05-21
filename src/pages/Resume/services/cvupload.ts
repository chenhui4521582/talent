import request from '@/utils/request';

export interface IJobParams {
  jobName: string;
  jobId: number
};

export async function selectJob() {
  return request(`/api/talent/job/listJobOption`, {
    method: 'POST',
    data: {}
  })
};

export async function insertResume(params) { // 已下载简历上传解析
  let filedata = new FormData();
  if(params.files){
    filedata.append('files',params.files);
  }
  for (let item in params) {
    if(item !== 'files' && params[item]){
      filedata.append(item, params[item]);
    }
  }
  return request(`/api/talent/resume/insertResume`, {
    method: 'POST',
    data: filedata
  })
};

export async function updateDownResume(params) {
  return request(`/api/talent/resume/updateDownResume`, { // 更新已下载简历
    method: 'POST',
    data: params
  })
}