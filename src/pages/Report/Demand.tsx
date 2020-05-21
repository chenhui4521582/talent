import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryDemand } from './services/report';
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
    title: '岗位名称',
    dataIndex: 'positionName',
    key: 'positionName',
    align: 'center'
  }, {
    title: '需求人数',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center'
  }, {
    title: '简历推送数',
    dataIndex: 'sentResumeAmount',
    key: 'sentResumeAmount',
    align: 'center'
  }, {
    title: '面试人数 (推送占比)',
    dataIndex: 'interviewPercent',
    key: 'interviewPercent',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{record.interviewAmount}（{text}）</span>
      )
    }
  }, {
    title: '已入职人数 (需求占比)',
    dataIndex: 'entryPercent',
    key: 'entryPercent',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{record.entryAmount}（{text}）</span>
      )
    }
  }, {
    title: '待入职人数',
    dataIndex: 'pendingEntryAmount',
    key: 'pendingEntryAmount',
    align: 'center'
  }];
  const { TableContent } = useReport({
    queryMethod: queryDemand,
    columns,
  });
  return (
    <Card title="业务线招聘需求统计">
      <TableContent />
    </Card>
  )
}