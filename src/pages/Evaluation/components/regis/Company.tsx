import React from 'react';
import { Form, Select, DatePicker, Input } from 'antd';
import { useBusiness, useJob } from '@/models/global';
import { newPageFormItemLayout } from '@/types/ITypes';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  return(
    <div>
      <Form.Item
        label="公司"
        name={["companyModel","companyName"]}
        rules={[{ required: true, message: '请填写公司' }]}
        {...newPageFormItemLayout}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="部门"
        name={["companyModel","businessCode"]}
        rules={[{ required: true, message: '请选择部门' }]}
        {...newPageFormItemLayout}
      >
        <Select>
          {
            businessList?.map(item => {
              return <Option key={item.businessCode} value={item.businessCode}>{item.businessLineName}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="职位"
        name={["companyModel","positionId"]}
        rules={[{ required: true, message: '请选择职位' }]}
        {...newPageFormItemLayout}
      >
        <Select>
          {
            jobList?.map(item => {
              return <Option key={item.jobId} value={item.jobId}>{item.jobName}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="预计报道日期"
        name={["companyModel","enterTime"]}
        rules={[{ required: true, message: '请选择预计报道日期' }]}
        {...newPageFormItemLayout}
      >
        <DatePicker />
      </Form.Item>
    </div>
  )
}