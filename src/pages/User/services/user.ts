import request from '@/utils/request';

export interface LoginFormData{
  email: string,
  password: string
}

export async function login(data: LoginFormData) {
  return request('/api/odsApi/login/login', {
    method: 'post',
    data,
  });
}