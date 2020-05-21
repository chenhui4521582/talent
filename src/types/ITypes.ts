export interface GlobalResParams<T> {
  msg: string;
  obj: T;
  status: number;
};

export interface PaginationTableParams {
  pageNum: number;
  pageSize: number;
  [propName: string]: any;
}

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

export const newPageFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
}

export const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

export const ResumeStatus = {
  1: '未面试',
  2: '未通过',
  3: '已面试待入职',
  4: '未入职',
  5: '在职',
  6: '离职'
};