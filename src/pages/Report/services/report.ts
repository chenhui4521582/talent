import request from '@/utils/request';

export async function queryDemand(params) {
  return request('/api/talent/statistics/listRecruitByBusiness', {
    method: 'POST',
    data: params
  });
}

export async function queryChioce(params) {
  return request('/api/talent/statistics/listResumeFilter', {
    method: 'POST',
    data: params
  });
}

export async function queryPass(params) {
  return request('/api/talent/statistics/listResumePass', {
    method: 'POST',
    data: params
  });
}

export async function queryEntry(params) {
  return request('/api/talent/statistics/listEntry', {
    method: 'POST',
    data: params
  });
}

export async function queryCompletedTime(params) {
  return request('/api/talent/statistics/listHrDemandAvgTime', {
    method: 'POST',
    data: params
  });
}

export async function queryCompletedRate(params) {
  return request('/api/talent/statistics/listHrEfficiency', {
    method: 'POST',
    data: params
  });
}

export async function queryValidity(params) {
  return request('/api/talent/statistics/listEffectiveChannel', {
    method: 'POST',
    data: params
  });
}

export async function queryAdjust(params) {
  return request('/api/talent/statistics/listDemandChange', {
    method: 'POST',
    data: params
  });
}