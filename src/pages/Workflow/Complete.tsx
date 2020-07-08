import React from 'react';
import { Card } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { myDoneListPage, tsList } from './services/home';
import { Link } from 'umi';
import { ColumnProps } from 'antd/es/table';

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
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },

    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record: tsList) => <span>{status[record.status]}</span>,
    },
    {
      title: '当前节点',
      dataIndex: 'currStepStr',
      key: 'currStepStr',
      align: 'center',
    },
    {
      title: '未操作者',
      dataIndex: 'dealUser',
      key: 'dealUser',
      align: 'center',
      width: '15vw',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
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
    queryMethod: myDoneListPage,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/listDoneFormPage',
  });

  return (
    <Card title="已办流程">
      <TableContent />
    </Card>
  );
};
