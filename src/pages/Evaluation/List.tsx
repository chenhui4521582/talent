import React, { useState } from 'react';
import { Card, Modal, Form, Row, Col, Input, Select } from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { queryList } from './services/evaluation';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;
export default () => {
  const [curRecord, setCurRecord] = useState<any>();
  const [modalName, setModalName] = useState<string>('');
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      dataIndex: 'nId',
      key: 'nId',
      align: 'center',
    },
    {
      title: '业务线',
      dataIndex: 'businessLineName',
      key: 'businessLineName',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
    },
    {
      title: '职级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
    },
    {
      title: '应聘人',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '面试时间',
      dataIndex: 'interviewTime',
      key: 'interviewTime',
      align: 'center',
    },
    {
      title: '是否参加面试',
      dataIndex: 'interviewFlag',
      key: 'interviewFlag',
      align: 'center',
      render: text => {
        const data = { 0: '不参加', 1: '参加' };
        return <span>{data[text]}</span>;
      },
    },
    {
      title: '面试官',
      dataIndex: 'interviewerName',
      key: 'interviewerName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: text => {
        const data = {
          0: '面试不通过',
          1: '待沟通',
          2: '待面试',
          3: '待录用',
          4: '已录用',
          5: '拒绝面试',
          6: '已入职',
          7: '未入职',
          11: '确认入职',
        };
        return <span>{data[text]}</span>;
      },
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      align: 'center',
      render: text => {
        return <span>{text ? text : '--'}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a onClick={e => showBack(record, 'show')}> 查看反馈</a>
          </span>
        );
      },
    },
  ];
  const { TableContent } = useTable({
    queryMethod: queryList,
    columns,
    rowKeyName: 'nId',
    cacheKey: 'evaluation/listAllInterview',
  });

  const showBack = (record, type: string) => {
    setCurRecord(record);
    setModalName(type);
  };

  const cancelModal = () => {
    setCurRecord(undefined);
    setModalName('');
  };

  return (
    <Card title="面试列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="应聘人" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="状态" name="status">
              <Select allowClear={true}>
                <Option value={0}>不通过</Option>
                <Option value={2}>待面试</Option>
                <Option value={3}>待录用</Option>
                <Option value={4}>已录用</Option>
                <Option value={5}>未面试</Option>
                <Option value={11}>确认入职</Option>
                <Option value={6}>已入职</Option>
                <Option value={7}>未入职</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>

      <Modal
        visible={modalName === 'show'}
        title="查看反馈"
        onOk={cancelModal}
        onCancel={cancelModal}
        cancelText="取消"
        okText="确定"
      >
        <div> 面试官反馈: {curRecord?.interviewEvaluation}</div>
        <div style={{ marginTop: 20 }}> HR反馈: {curRecord?.hrEvaluation}</div>
      </Modal>
    </Card>
  );
};
