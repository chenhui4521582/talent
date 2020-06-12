import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Input, Form } from 'antd';
import { IResumeCompany, tsCompany } from '../services/company';

function Company(props: tsCompany, formRef) {
  const [form] = Form.useForm();
  const { name, paramName, defaultValue } = props;

  useEffect(() => {
    console.log(defaultValue);
    if (defaultValue) {
      let obj = {};
      obj[paramName] = defaultValue;
      console.log(defaultValue);
      form.setFieldsValue(obj);
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
        label={name}
        name={paramName}
        rules={[{ required: true, message: `请输入${name}` }]}
      >
        <Input type="text" placeholder={`请输入${name}`} />
      </Form.Item>
    </Form>
  );
}
export default forwardRef(Company);
