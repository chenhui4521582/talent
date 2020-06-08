import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Select, Form } from 'antd';
import { tsCompany } from '../services/company';
import { useCompany } from '@/models/global';

const { Option } = Select;

function Company(props: tsCompany, formRef) {
  const { companyList } = useCompany();
  const [form] = Form.useForm();

  useEffect(() => {
    for (let i = 0; i < companyList.length; i++) {
      if (companyList[i].companyName === props.optionName) {
        form.setFieldsValue({ companyId: companyList[i].companyId });
      }
    }
  });

  useImperativeHandle(formRef, () => {
    return {
      ok() {
        form.submit();
      },
      reset() {
        form.resetFields();
      },
    };
  });

  return (
    <Form form={form} onFinish={props.handleAdd}>
      <Form.Item
        label="公司名称"
        name="companyId"
        rules={[{ required: true, message: '请选择公司名称' }]}
      >
        <Select placeholder="请选择名称">
          {companyList.map(item => {
            return (
              <Option key={item.companyId} value={item.companyId}>
                {item.companyName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
}
export default forwardRef(Company);
