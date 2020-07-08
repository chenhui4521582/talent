import React from 'react';
import { Card, Divider, Form, Row, Col, Input, DatePicker } from 'antd';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { listRegisterStaff } from './services/registration';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '预报到时间',
      dataIndex: 'enterTime',
      key: 'enterTime',
      align: 'center',
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      key: 'companyName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'positionName',
      key: 'positionName',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: '证件照',
      dataIndex: 'idPhoto',
      key: 'idPhoto',
      align: 'center',
      render: text => {
        return (
          <span style={{ display: 'block', width: 60, margin: 'auto' }}>
            <img style={{ width: '100%' }} src={text} alt="" />
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a onClick={e => handlePrint(record.resumeId)}>打印预览</a>
            <Divider type="vertical" />
            <Link to={`edit?resumeId=${record.resumeId}`}>编辑</Link>
          </span>
        );
      },
    },
  ];
  const { TableContent } = useTable({
    queryMethod: listRegisterStaff,
    columns,
    rowKeyName: 'resumeId',
    cacheKey: 'registerStaff/admin/listRegisterStaff',
  });
  const handlePrint = (resumeId: string) => {
    window.open(`print?resumeId=${resumeId}&type=2`);
  };
  return (
    <Card title="员工登记表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="开始时间" name="startTime">
              <DatePicker format="YYYY-MM-DD" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="结束时间" name="endTime">
              <DatePicker format="YYYY-MM-DD" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="姓名" name="realName">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="手机号码" name="phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="公司" name="companyName">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
