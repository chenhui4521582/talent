import React from 'react';
import { Card, Button, Divider, Switch, notification } from 'antd';
import { Link } from 'umi';

import { useReq } from '@/components/GlobalTable/useReq';
import { homeList, changeState } from './services/new';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';

interface tsList {
  id: number;
  name: string;
  status: number;
}

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={!!record.status}
            onChange={() => {
              onChange(record.id);
            }}
          />
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

  const onChange = async id => {
    let res: GlobalResParams<string> = await changeState(id);
    if (res.status === 200) {
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
  };

  const { TableContent, refresh } = useReq({
    queryMethod: homeList,
    columns,
    rowKeyName: 'id',
    cacheKey: '/wfresform/getList',
  });
  return (
    <Card
      title="工作流列表"
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
