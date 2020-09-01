import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Card, notification, Modal, Button, Divider } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { ColumnProps } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { list, deleteById, IListItem } from './services/list';
import { GlobalResParams } from '@/types/ITypes';

export default () => {
  const columns: ColumnProps<IListItem>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: IListItem) => (
        <span>
          <Link to={`edit/${record.id}`}>修改</Link>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleDelete(record);
            }}
          >
            删除
          </a>
        </span>
      ),
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: list,
    columns,
    rowKeyName: 'id',
    cacheKey: '/announcement/listAll',
  });

  const handleDelete = (record: IListItem): void => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await deleteById({ id: record.id });
        if (res.status === 200) {
          refresh();
          notification['success']({
            message: res.msg,
            description: '',
          });
        } else {
          notification['error']({
            message: res.msg,
            description: '',
          });
        }
      },
    });
  };

  return (
    <Card
      title="公告列表"
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.location.href = 'new';
          }}
        >
          新增公告
        </Button>
      }
    >
      <TableContent />
    </Card>
  );
};
