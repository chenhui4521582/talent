import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryPass } from './services/report';
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
    title: '筛选通过简历数',
    dataIndex: 'passFilterAmount',
    key: 'passFilterAmount',
    align: 'center'
  }, {
    title: '面试官面试简历数',
    dataIndex: 'interviewAmount',
    key: 'interviewAmount',
    align: 'center'
  }, {
    title: '面试官面试通过数',
    dataIndex: 'passInterviewAmount',
    key: 'passInterviewAmount',
    align: 'center',
  }, {
    title: '面试官面试通过率',
    dataIndex: 'passInterviewPercent',
    key: 'passInterviewPercent',
    align: 'center',
  }];
  const { TableContent } = useReport({
    queryMethod: queryPass,
    columns,
  });
  return (
    <Card title="简历面试通过率">
      <TableContent />
    </Card>
  )
}