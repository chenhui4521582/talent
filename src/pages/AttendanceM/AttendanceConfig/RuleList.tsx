import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import {
  ruleList,
  saveRule,
  updateRule,
  getRuleDetail,
  deleteRule,
} from './services/rule';
import {
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Divider,
  Modal,
  Checkbox,
} from 'antd';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '打卡类型',
      dataIndex: 'firstBusinessName',
      key: 'firstBusinessName',
      align: 'center',
    },
    {
      title: '手机打卡',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '打卡地点',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Link
              to={`/talent/staff/detail?employeeId=${record.employeeId}&resumeId=${record.resumeId}`}
            >
              排班
            </Link>
            <Divider type="vertical" />
            <Link
              to={`/talent/staff/detail?employeeId=${record.employeeId}&resumeId=${record.resumeId}`}
            >
              编辑
            </Link>
            <Divider type="vertical" />
            <Link
              to={`/talent/staff/detail?employeeId=${record.employeeId}&resumeId=${record.resumeId}`}
            >
              删除
            </Link>
          </>
        );
      },
    },
  ];
  const { TableContent, searchForm } = useTable({
    queryMethod: ruleList,
    columns,
    rowKeyName: 'id',
    cacheKey: '/attendance/rule/listRule',
  });

  return (
    <Card
      title="规则列表"
      extra={
        <div>
          <Button style={{ marginLeft: 10 }}>
            <Link to={`/talent/attendanceconfig/addrule`}>新增</Link>
          </Button>
        </div>
      }
    >
      <TableContent></TableContent>
    </Card>
  );
};
