import React from 'react';
import { useCommon } from './components/useCommon';
import { ColumnProps } from 'antd/es/table';
import { queryValidity } from './services/report';
import {
  Card
} from 'antd';

export default () => {
  const columns: ColumnProps<any>[] = [{
    title: '简历来源',
    dataIndex: 'channel',
    key: 'channel',
    align: 'center',
    render: (text) => {
      const data = {1: 'Boss', 2: '拉勾',3: '猎聘',4: '智联',7: '前程',8: '其它',9: '内推'};
      return <span>{data[text]}</span>
    }
  }, {
    title: '已下载简历数',
    dataIndex: 'downloadedAmount',
    key: 'downloadedAmount',
    align: 'center'
  }, {
    title: '已入职人数',
    dataIndex: 'entryAmount',
    key: 'entryAmount',
    align: 'center'
  }, {
    title: '简历有效性',
    dataIndex: 'effectiveRate',
    key: 'effectiveRate',
    align: 'center',
  }];
  const { TableContent } = useCommon({
    queryMethod: queryValidity,
    columns,
  });
  return (
    <Card title="渠道简历有效性统计">
      <TableContent />
    </Card>
  )
}