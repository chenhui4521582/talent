import React from 'react';
import { Card } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { myToDoListPage, tsList } from './services/home';
import { Link } from 'umi';
import { ColumnProps } from 'antd/es/table';

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '当前节点',
      dataIndex: 'currStepName',
      key: 'currStepName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: tsList) => (
        <Link to={`detail/${record.id}`}>点击查看</Link>
      ),
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: myToDoListPage,
    columns,
    rowKeyName: 'id',
  });

  return (
    <Card title="我的流程">
      <TableContent />
    </Card>
  );
};
