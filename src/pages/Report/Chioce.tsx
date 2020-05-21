import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryChioce } from './services/report';
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
    title: '推送简历数',
    dataIndex: 'sentResumeAmount',
    key: 'sentResumeAmount',
    align: 'center'
  }, {
    title: '筛选通过数',
    dataIndex: 'passAmount',
    key: 'passAmount',
    align: 'center',
  }, {
    title: '筛选通过率',
    dataIndex: 'passPercent',
    key: 'passPercent',
    align: 'center',
  }];
  const { TableContent } = useReport({
    queryMethod: queryChioce,
    columns,
  });
  return (
    <Card title="简历筛选通过情况">
      <TableContent />
    </Card>
  )
}