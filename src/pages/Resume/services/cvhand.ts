import request from '@/utils/request';

export interface IWorkParams {
  id?: number;
  companyName: string;
  position: string;
  beginDate: string;
  endDate: string;
  achievement: string;
}

export interface IEduParams {
  id?: number;
  schoolName: string;
  major: string;
  degree: string;
  beginDate: string;
  endDate: string;
  description: string;
}

export interface IResumeDetail {
  resumeId: string;
  name: string;
  positionId: number;
  status: number;
  source: number;
  resumeUrl: string;
  sex: number;
  phone: string;
  email: string;
  jobIntention: string;
  currentStatus: string;
  degree: number;
  worksUrl: string;
  workExp: IWorkParams[];
  eduExp: IEduParams[];
  feedbackList: any[];
}

export async function getResumeDetail(resumeId: string, resumeStatus: string) {
  // 简历详情
  return request(`/api/talent/resume/getResumeDetail`, {
    method: 'POST',
    data: {
      resumeId,
      resumeStatus,
    },
  });
}

export async function uploadResume(params) {
  let filedata = new FormData();
  if (params.files) {
    filedata.append('files', params.files);
  }
  for (let item in params) {
    if (item !== 'files' && params[item]) {
      filedata.append(item, params[item]);
    }
  }
  return request(`/api/talent/resume/uploadResume`, {
    method: 'post',
    data: filedata,
  });
}

export async function saveFile(params) {
  // 作品上传
  let filedata = new FormData();
  if (params.files) {
    filedata.append('files', params.files);
  }
  for (let item in params) {
    if (item !== 'files' && params[item]) {
      filedata.append(item, params[item]);
    }
  }
  return request(`/api/transmit/upload/saveFile`, {
    method: 'post',
    data: filedata,
  });
}

export async function saveResume(params) {
  // 添加下载简历
  return request(`/api/talent/resume/saveResume`, {
    method: 'POST',
    data: params,
  });
}

export async function updateResume(params) {
  return request(`/api/talent/resume/updateResume`, {
    // 下载简历修改
    method: 'POST',
    data: params,
  });
}

export async function updateResumeUndown(params) {
  return request(`/api/talent/resume/updateResumeUndown`, {
    // 未下载简历修改
    method: 'POST',
    data: params,
  });
}

export async function saveResumeUndown(params) {
  // 添加未下载简历
  return request(`/api/talent/resume/saveResumeUndown`, {
    method: 'POST',
    data: params,
  });
}
