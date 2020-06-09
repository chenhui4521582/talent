import request from '@/utils/request';

export interface IResumeCompany {
  companyId: number;
  companyName: string | null;
  createTime: string | null;
  updateTime: string | null;
}

export interface tsRefs {
  reset: () => void;
  ok: () => void;
}

export interface tsCompany {
  handleAdd: (values) => Promise<void>;
  defaultValue: string | undefined;
  name: string;
  paramName: string;
}

export async function listCompany() {
  // 成本中心列表
  return request(`/api/talent/company/listCompanyOption`, {
    method: 'POST',
  });
}
