import React from 'react';
import { Card, Divider, Form, Row, Col, Input, DatePicker } from 'antd';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { listRegister } from './services/application';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '申请职位',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
    },
    {
      title: '期望月薪',
      dataIndex: 'expectedSalary',
      key: 'expectedSalary',
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
      dataIndex: 'mobile',
      key: 'mobile',
      align: 'center',
    },
    {
      title: '学校',
      dataIndex: 'college',
      key: 'college',
      align: 'center',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      align: 'center',
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      align: 'center',
      render: text => {
        const data = [
          '高中以下',
          '高中',
          '中专',
          '大专',
          '大学本科',
          '研究生',
          '博士生',
          '博士后',
          '院士',
        ];
        return <span> {data[text]}</span>;
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
            <Link to={`interviewedit?resumeId=${record.baseId}`}>编辑</Link>
          </span>
        );
      },
    },
  ];
  const { TableContent } = useTable({
    queryMethod: listRegister,
    columns,
    rowKeyName: 'baseId',
    cacheKey: 'registerApplicationBase/admin/listRegister',
  });
  const handlePrint = (resumeId: string) => {
    window.open(`print?resumeId=${resumeId}&type=1`);
  };
  return (
    <Card title="应聘登记表">
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
            <Form.Item label="手机号码" name="mobile">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="申请职位" name="position">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
