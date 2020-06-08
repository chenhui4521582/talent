import React, { useState, useRef } from 'react';
import { Card } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { listPage } from './services/home';
import { Link } from 'umi';
import { ColumnProps } from 'antd/es/table';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '请求成本',
      key: 'costCenterName',
      dataIndex: 'costCenterName',
      align: 'center',
    },
    {
      title: '工作流',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '创建日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '当前节点',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: any) => <Link to={`detail?id=${'1'}`}>点击查看</Link>,
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: listPage,
    columns,
    rowKeyName: 'id',
  });

  return (
    <Card title="待办事宜">
      <TableContent />
    </Card>
  );
};
