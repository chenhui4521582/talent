import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Select, Form } from 'antd';
import { listCompany, IResumeCompany, tsCompany } from '../services/company';

const { Option } = Select;

function Company(props: tsCompany, formRef) {
  const [optionList, setOptionList] = useState<Array<IResumeCompany>>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    async function getcompanyList() {
      let companyObj = await listCompany();
      if (companyObj.status === 200) {
        setOptionList(companyObj.obj);
      }
    }
    getcompanyList();
  }, []);

  useEffect(() => {
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].companyName === props.optionName) {
        form.setFieldsValue({ companyId: optionList[i].companyId });
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
          {optionList.map(item => {
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
