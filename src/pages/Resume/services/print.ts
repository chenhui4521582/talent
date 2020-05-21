import request from '@/utils/request';

export async function getResumePDFUrl(resumeId: string, resumeStatus: string) { // 简历PDF地址
  return request(`/api/talent/resume/getResumePDFUrl`, {
    method: 'POST',
    data: { resumeId, resumeStatus }
  })
}