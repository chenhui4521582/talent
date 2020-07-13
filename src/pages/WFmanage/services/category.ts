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

export async function categoryList() {
  return request(`/api/talent/wfResFormCategory/getCategoryList`, {
    method: 'POST',
  });
}
