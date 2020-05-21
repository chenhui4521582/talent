import React from 'react';
import { useReport } from './components/useReport';
import { ColumnProps } from 'antd/es/table';
import { queryEntry } from './services/report';
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
    title: '面试总人数',
    dataIndex: 'interviewAmount',
    key: 'interviewAmount',
    align: 'center'
  }, {
    title: '已入职人数',
    dataIndex: 'entryAmount',
    key: 'entryAmount',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{text}（{record.entryPercent}）</span>
      )
    }
  }, {
    title: '待入职人数',
    dataIndex: 'pendingEntryAmount',
    key: 'pendingEntryAmount',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{text}（{record.pendingEntryPercent}）</span>
      )
    }
  }, {
    title: '待定人数',
    dataIndex: 'pendingHrDescideAmonut',
    key: 'pendingHrDescideAmonut',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{text}（{record.pengdingHrDescidePercent}）</span>
      )
    }
  }, {
    title: 'PASS人数',
    dataIndex: 'passInterviewAmount',
    key: 'passInterviewAmount',
    align: 'center',
    render: (text, record) => {
      return(
        <span>{text}（{record.passInterviewPercent}）</span>
      )
    }
  }];
  const { TableContent } = useReport({
    queryMethod: queryEntry,
    columns,
  });
  return (
    <Card title="面试人员入职情况">
      <TableContent />
    </Card>
  )
}