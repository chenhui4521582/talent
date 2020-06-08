import request from '@/utils/request';

export interface tsRefs {
  reset: () => void;
  ok: () => void;
}

export interface tsCompany {
  handleAdd: (values) => Promise<void>;
  optionName: string | undefined;
}
