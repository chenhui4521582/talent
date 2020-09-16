// 添加排班
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Modal, Form, Input, TimePicker, Checkbox, Radio } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import locale from 'antd/lib/calendar/locale/zh_CN.js';

const { RangePicker } = TimePicker;
export default forwardRef((props, formRef) => {
  const [form] = Form.useForm();
  const [inputNameList, setInputNameList] = useState<any[]>([0]);

  useImperativeHandle(formRef, () => {
    return {
      getvalue: form,
    };
  });

  return (
    <Form form={form}>
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
        <RangePicker allowClear={true} picker="time" locale={locale} />
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
    </Form>
  );
});
