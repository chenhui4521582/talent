//新增规则
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Button, Modal, Radio, Checkbox } from 'antd';
import AddUserList from './components/AddUserList';
import AddTime from './components/AddTime';
import AddSchedulingList from './components/AddSchedulingList';

export default props => {
  const [form] = Form.useForm();

  return (
    <Card title="新增规则">
      <Form form={form}>
        <Form.Item
          label="规则名称"
          name="ruleName"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: 400, marginBottom: 40 }}
        >
          <Input placeholder="规则名称" />
        </Form.Item>

        <Form.Item
          label="规则类型"
          name="ruleType"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: 400, marginBottom: 20 }}
        >
          <Radio.Group>
            <Radio value={0} style={{ display: 'block', marginBottom: 6 }}>
              固定时间上下班
            </Radio>
            <Radio value={1} style={{ display: 'block', marginBottom: 6 }}>
              按排班上下班
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="打卡人员"
          name="userCodes"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: '70vw', marginBottom: 20, minHeight: '40px' }}
        >
          <AddUserList {...props} />
        </Form.Item>

        <Form.Item
          label="排班设置"
          name="userCodes"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: '70vw', marginBottom: 20, minHeight: '40px' }}
        >
          <AddSchedulingList {...props} />
        </Form.Item>

        {/* <Form.Item
          label="打卡时间"
          name="clockTimes"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ width: 400, marginBottom: 20 }}
        >
          <Input placeholder="打卡时间" />
        </Form.Item>

        <Form.Item
          label="手机打卡"
          name="enablePhoneClock"
          rules={[{ required: true, message: '请输入用户名称!' }]}
          style={{ marginBottom: 20 }}
        >
          <Checkbox value={1}>
            开启 开启手机端打卡，考勤状态将和门禁系统打卡结合统计
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="打卡地点"
          name="areas"
          rules={[{ required: true, message: '请输入用户名称!' }]}
        >
          <Checkbox value={1}>
            开启 开启手机端打卡，考勤状态将和门禁系统打卡结合统计
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="手机提醒"
          name="areas"
          rules={[{ required: true, message: '请输入用户名称!' }]}
        >
          <Checkbox value={1}>
            开启 开启手机端打卡，考勤状态将和门禁系统打卡结合统计
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="范围外打卡"
          name="areas"
          rules={[{ required: true, message: '请选择范围外打卡!' }]}
        >
          <Radio.Group>
            <Radio value={0}>允许范围外打卡，记录为打卡异常</Radio>
            <Radio value={1}>不允许范围外打卡</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="规则生效时间"
          name="areas"
          rules={[{ required: true, message: '请选择规则生效时间!' }]}
        >
          <Radio.Group>
            <Radio value={0}>明日生效</Radio>
            <Radio value={1}>立即生效</Radio>
          </Radio.Group>
        </Form.Item> */}
      </Form>
    </Card>
  );
};
