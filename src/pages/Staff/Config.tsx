import React, { useEffect } from 'react';
import {
  Card, Form, Input, Select, Button, notification
} from 'antd';
import { newPageFormItemLayout, GlobalResParams, submitFormLayout } from '@/types/ITypes';
import { getconfigRoster, saveConfigureRoster } from './services/staff';

const { Option } = Select;
const { TextArea } = Input;
export default () => {
  const [form] = Form.useForm();
  useEffect(() => {
    async function getDetail() {
      let res: GlobalResParams<any> = await getconfigRoster();
      form.setFieldsValue(res?.obj);
    }
    getDetail();
  }, []);
  const handleReset = () => {
    form.resetFields();
  };
  const handleSubmit = async (values) => {
    let res: GlobalResParams<string> = await saveConfigureRoster(values);
    if(res.status === 200) {
      notification['success']({
        message: res.msg,
        description: '',
      });
    }else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };
  return (
    <Card title="花名册配置">
      <Form
        form={form}
        {...newPageFormItemLayout}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="合同期限"
          name="contractPeriod"
          rules={[{ required: true, message: '请选择合同期限' }]}
        >
          <Select placeholder="请选择合同期限">
            <Option value={1} key={1}>1年</Option>
            <Option value={2} key={2}>2年</Option>
            <Option value={3} key={3}>3年</Option>
            <Option value={4} key={4}>4年</Option>
            <Option value={5} key={5}>5年</Option>
            <Option value={6} key={6}>6年</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="合同到期提醒提前时间"
          name="contractReminder"
          rules={[{ required: true, message: '请选择合同到期提醒提前时间' }]}
        >
          <Select placeholder="请选择合同到期提醒提前时间">
            <Option value={1} key={1}>1个月</Option>
            <Option value={2} key={2}>2个月</Option>
            <Option value={3} key={3}>3个月</Option>
            <Option value={4} key={4}>4个月</Option>
            <Option value={5} key={5}>5个月</Option>
            <Option value={6} key={6}>6个月</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="合同到期提醒人"
          name="contractRemindPeople"
          rules={[{ required: true, message: '请输入合同到期提醒人' }]}
          extra="多个手机号码请用小写的英文英文逗号','分割"
        >
          <TextArea rows={4} placeholder="请输入合同到期提醒人" />
        </Form.Item>

        <Form.Item
          label="试用期时长"
          name="probationPeriod"
          rules={[{ required: true, message: '请选择试用期时长' }]}
        >
          <Select placeholder="请选择试用期时长">
            <Option value={1} key={1}>1个月</Option>
            <Option value={2} key={2}>2个月</Option>
            <Option value={3} key={3}>3个月</Option>
            <Option value={4} key={4}>4个月</Option>
            <Option value={5} key={5}>5个月</Option>
            <Option value={6} key={6}>6个月</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="试用期到期提醒提前时间"
          name="probationReminder"
          rules={[{ required: true, message: '请选择试用期到期提醒提前时间' }]}
        >
          <Select placeholder="请选择试用期到期提醒提前时间">
            <Option value={1} key={1}>1个月</Option>
            <Option value={2} key={2}>2个月</Option>
            <Option value={3} key={3}>3个月</Option>
            <Option value={4} key={4}>4个月</Option>
            <Option value={5} key={5}>5个月</Option>
            <Option value={6} key={6}>6个月</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="试用期到期提醒人"
          name="probationRemindPeople"
          rules={[{ required: true, message: '请输入试用期到期提醒人' }]}
          extra="多个手机号码请用小写的英文英文逗号','分割"
        >
          <TextArea rows={4} placeholder="请输入试用期到期提醒人" />
        </Form.Item>

        <Form.Item {...submitFormLayout}>
          <Button type="primary" htmlType="submit" style={{marginRight: 20, marginTop: 20}}>
            保存
          </Button>
          <Button onClick={handleReset} >
            重置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}