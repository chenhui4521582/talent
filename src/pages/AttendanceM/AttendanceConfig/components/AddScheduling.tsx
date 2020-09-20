// 添加排班
import React, { useImperativeHandle, forwardRef } from 'react';
import { Form, Input, TimePicker, Radio, Select } from 'antd';
import locale from 'antd/lib/calendar/locale/zh_CN.js';

const { RangePicker } = TimePicker;
const { Option } = Select;
export default forwardRef((props, formRef) => {
  const [form] = Form.useForm();

  useImperativeHandle(formRef, () => {
    return {
      getvalue: form,
    };
  });

  return (
    <Form form={form}>
      <Form.Item
        label="scheduleId"
        name="scheduleId"
        style={{ width: 400, marginBottom: 40, display: 'none' }}
      >
        <Input placeholder="规则名称" />
      </Form.Item>
      <Form.Item
        label="班次名称"
        name="name"
        rules={[{ required: true, message: '请输入班次名称!' }]}
        style={{ width: 400, marginBottom: 40 }}
      >
        <Input placeholder="规则名称" />
      </Form.Item>
      <Form.Item
        label="打卡时间"
        name="clockPeriods"
        style={{ width: 400, marginBottom: 40 }}
        rules={[{ required: true, message: '请输入打卡时间!' }]}
      >
        <RangePicker
          format="HH:mm"
          allowClear={true}
          picker="time"
          locale={locale}
          style={{ marginBottom: 10 }}
        />
      </Form.Item>

      <Form.Item
        label="休息时间"
        name="breakTimeStart-breakTimeEnd"
        rules={[{ required: true, message: '请输入休息时间!' }]}
        style={{ width: 400, marginBottom: 40 }}
      >
        <RangePicker
          format="HH:mm"
          allowClear={true}
          picker="time"
          locale={locale}
        />
      </Form.Item>
      <Form.Item
        label="是否开启"
        name="breakTimeCalculation"
        rules={[
          {
            required: true,
            message: '请选择是否开启休息时间内不计算工作时长!',
          },
        ]}
        style={{ width: 400, marginBottom: 40 }}
      >
        <Radio.Group>
          <Radio value={0} style={{ display: 'block', marginBottom: 6 }}>
            不开启（休息时间内不计算工作时长）
          </Radio>
          <Radio value={1} style={{ display: 'block', marginBottom: 6 }}>
            开启（休息时间内计算工作时长）
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="打卡时间限制">
        <Input.Group compact>
          <Form.Item
            name={['itemList', 'startLimit']}
            rules={[{ required: true, message: '请选择时间段!' }]}
            label="可打上班卡"
            initialValue={1}
          >
            <Select placeholder="请选择" style={{ minWidth: 200 }}>
              <Option value={1}>三小时内</Option>
              <Option value={2}>二小时内</Option>
              <Option value={3}>一小时内</Option>
              <Option value={4}>4三十分钟内</Option>
              <Option value={5}>十五分钟内</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['itemList', 'endLimit']}
            rules={[{ required: true, message: '请选择时间段!' }]}
            label="可打下班卡"
            initialValue={1}
            style={{ paddingLeft: 20 }}
          >
            <Select placeholder="请选择" style={{ minWidth: 200 }}>
              <Option value={1}>八小时</Option>
              <Option value={2}>六小时</Option>
              <Option value={3}>四小时</Option>
              <Option value={4}>三小时</Option>
              <Option value={5}>二小时</Option>
              <Option value={6}>一小时</Option>
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>
    </Form>
  );
});
