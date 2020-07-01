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
