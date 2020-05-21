import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryCompletedTime } from './services/report';
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
    title: '招聘岗位',
    dataIndex: 'positionName',
    key: 'positionName',
    align: 'center'
  }, {
    title: '平均完成时间（自然日）',
    dataIndex: 'avgTime',
    key: 'avgTime',
    align: 'center'
  }];
  const { TableContent } = useReport({
    queryMethod: queryCompletedTime,
    columns,
  });
  return (
    <Card title="HR岗位完成时间">
      <TableContent />
    </Card>
  )
}