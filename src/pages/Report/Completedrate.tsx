import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryCompletedRate } from './services/report';
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
    title: 'HR',
    dataIndex: 'hrName',
    key: 'hrName',
    align: 'center'
  }, {
    title: '招聘岗位',
    dataIndex: 'positionName',
    key: 'positionName',
    align: 'center'
  }, {
    title: '单位时间完成率',
    dataIndex: 'consummationRate',
    key: 'consummationRate',
    align: 'center'
  }];
  const { TableContent } = useReport({
    queryMethod: queryCompletedRate,
    columns,
  });
  return (
    <Card title="HR单位时间完成率">
      <TableContent />
    </Card>
  )
}