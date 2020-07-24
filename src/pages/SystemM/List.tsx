import React, { useState } from 'react';
import { Card, Table, Button, Form, Row, Col } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'umi';

const sexHash = { 1: '男', 2: '女' };

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
      render: (_, record) => {
        return <span>{sexHash[record.sex]}</span>;
      },
    },
    {
      title: '一级业务',
      dataIndex: 'firstBusinessName',
      key: 'firstBusinessName',
      align: 'center',
    },
    {
      title: '二级业务',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '组别',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: '技术岗位',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
    },
    {
      title: '角色名称',
      key: 'action',
      align: 'center',
    },
  ];

  const [form] = Form.useForm();

  return (
    <Card title="用户角色管理">
      <Form form={form}>
        <Row>
          <Form.Item label="一级业务"></Form.Item>
          <Form.Item label="二级业务"></Form.Item>
          <Form.Item label="部门"></Form.Item>
          <Form.Item label="组别"></Form.Item>
        </Row>
        <Row>
          <Form.Item label="工号"></Form.Item>
          <Form.Item label="姓名"></Form.Item>
        </Row>
      </Form>
    </Card>
  );
};
