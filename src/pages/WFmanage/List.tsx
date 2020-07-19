import React from 'react';
import { Card, Button, Divider } from 'antd';
import { Link } from 'umi';

import { useReq } from '@/components/GlobalTable/useReq';
import { historyList } from './services/history';
import { ColumnProps } from 'antd/es/table';

interface tsList {
  id: number;
  name: string;
  status: number;
}

const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '申请部门',
      dataIndex: 'applyDepartmentName',
      key: 'applyDepartmentName',
      align: 'center',
    },
    {
      title: '申请人',
      dataIndex: 'applyTruename',
      key: 'applyTruename',
      align: 'center',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return <span>{status[record.status]}</span>;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link to={`applicationrecord/${record.id}`}>申请记录</Link>
            <Divider type="vertical" />
            <Link to={`editForm/${record.id}`}>表单设置</Link>
            <Divider type="vertical" />
            <Link to={`editRule/${record.id}`}>规则设置</Link>
          </span>
        );
      },
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: historyList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/taskFormListByCondition',
  });
  return (
    <Card
      title="工作流列表/申请记录"
      extra={
        <Link to="/talent/wfmanage/new">
          <Button type="primary">{`新增工作流`}</Button>
        </Link>
      }
    >
      <TableContent />
    </Card>
  );
};
