import React from 'react';
import {
  Card, notification, Divider, Form, Row, Col, Input, Modal
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { queryEntry, entryJob } from './services/entry';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  const columns: ColumnProps<any>[] = [{
    title: '编号',
    dataIndex: 'nId',
    key: 'nId',
    align: 'center'
  }, {
    title: '业务线',
    dataIndex: 'businessLineName',
    key: 'businessLineName',
    align: 'center'
  }, {
    title: '岗位',
    dataIndex: 'jobName',
    key: 'jobName',
    align: 'center'
  }, {
    title: '职级',
    dataIndex: 'level',
    key: 'level',
    align: 'center'
  }, {
    title: '应聘人',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '入职时间',
    dataIndex: 'entryTime',
    key: 'entryTime',
    align: 'center'
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (text) => {
      const data = { 0: '面试不通过', 1: '待沟通', 2: '待面试', 3: '待录用', 4: '录用', 5: '拒绝面试' };
      return(
        <span>{data[text]}</span>
      )
    }
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return(
        <span>
          <a onClick={e => handleEntry(record, 5)}> 确认入职</a>
          <Divider type="vertical" />
          <a onClick={e => handleEntry(record, 4)}> 未入职</a>
        </span>
      )
    }
  }];
  const { TableContent, refresh } = useTable({
    queryMethod: queryEntry,
    columns,
    rowKeyName: 'nId'
  });
  const handleEntry = (record, status: number) => {
    Modal.confirm({
      title: status === 5 ? '确认此人入职？' : '确认此人不入职?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await entryJob({
          nId: record.nId,
          resumeId: record.resumeId,
          status
        });
        if(res.status === 200) {
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
      }
    });
  }
  return (
    <Card title="入职列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="应聘人"
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  )
}