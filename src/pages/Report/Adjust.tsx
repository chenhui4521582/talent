import React from 'react';
import { useCommon } from './components/useCommon';
import { ColumnProps } from 'antd/es/table';
import { queryAdjust } from './services/report';
import {
  Card
} from 'antd';

export default () => {
  const columns: ColumnProps<any>[] = [{
    title: '业务线',
    dataIndex: 'businessName',
    key: 'businessName',
    align: 'center'
  }, {
    title: '招聘需求调整数及总数',
    dataIndex: 'changeAmount',
    key: 'changeAmount',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{text}/{record.totalAmount}</span>
      )
    }
  }, {
    title: '平均调整时间（天）',
    dataIndex: 'avgChangeDay',
    key: 'avgChangeDay',
    align: 'center'
  }];
  const { TableContent } = useCommon({
    queryMethod: queryAdjust,
    columns,
  });
  return (
    <Card title="需求调整情况">
      <TableContent />
    </Card>
  )
}