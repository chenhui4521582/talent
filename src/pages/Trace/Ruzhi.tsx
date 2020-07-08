import React, { useState } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  notification,
  Modal,
  Input,
  Divider,
  Select,
  DatePicker,
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { queryRuzhi, queryActionRecord, updateStatus } from './services/trace';
import { GlobalResParams } from '@/types/ITypes';

const { TextArea } = Input;
export default () => {
  const [modalName, setModalName] = useState('');
  const [curRecord, setCurRecord] = useState<any>();
  const [form] = Form.useForm();
  const [curStatus, setCurStatus] = useState<number>(-1);
  const [recordList, setRecordList] = useState<any>();
  const columns: ColumnProps<any>[] = [
    {
      title: '简历ID',
      dataIndex: 'resumeId',
      key: 'resumeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: text => {
        if (text === 4) {
          return <span>已录用</span>;
        } else if (text === 11) {
          return <span>确认入职</span>;
        } else if (text === 6) {
          return <span>已入职</span>;
        } else if (text === 7) {
          return <span>未入职</span>;
        }
      },
    },
    {
      title: '确认状态',
      dataIndex: 'inform_status',
      key: 'inform_status',
      align: 'center',
      render: (_, record) => {
        if (record.status === 4) {
          return <span>未确认入职</span>;
        } else if (record.status === 11 || record.status === 6) {
          return <span>已确认入职</span>;
        } else if (record.status === 7) {
          return <span>已确认不入职</span>;
        }
      },
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a onClick={e => showModal(record, 'change')}>变更</a>
            <Divider type="vertical" />
            <a onClick={e => showModal(record, 'record')}>记录</a>
          </span>
        );
      },
    },
  ];

  const { TableContent, refresh } = useTable({
    queryMethod: queryRuzhi,
    columns,
    rowKeyName: 'resumeId',
    cacheKey: 'evaluation/listEmployed',
  });

  const showModal = async (record, type) => {
    if (type === 'record') {
      let res: GlobalResParams<any> = await queryActionRecord(record.nId);
      setRecordList(res?.obj);
    }
    setModalName(type);
    setCurRecord(record);
  };

  const cancelModal = () => {
    setModalName('');
    form.resetFields();
    setCurRecord(undefined);
    setRecordList(undefined);
  };

  const changeStatus = (value: number) => {
    setCurStatus(value);
  };

  const handleSubmit = async values => {
    values.entryTime = values.entryTime.format('YYYY-MM-DD');
    values.nId = curRecord.nId;
    let res: GlobalResParams<string> = await updateStatus(values);
    if (res.status === 200) {
      cancelModal();
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
  };

  return (
    <Card title="入职通知列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="姓名" name="name">
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={modalName === 'change'}
        title="变更状态"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        cancelText="取消"
        okText="确定"
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="入职状态"
            name="status"
            rules={[{ required: true, message: '请填写项目名称' }]}
          >
            <Select onChange={changeStatus}>
              <Select.Option value={11}>确认入职</Select.Option>
              <Select.Option value={7}>放弃入职</Select.Option>
            </Select>
          </Form.Item>
          {curStatus === 11 && (
            <Form.Item
              label="入职时间"
              name="entryTime"
              rules={[{ required: true, message: '请填写项目路由' }]}
            >
              <DatePicker />
            </Form.Item>
          )}
          <Form.Item label="变更备注" name="evaluation">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={modalName === 'record'}
        title="变更记录"
        onOk={cancelModal}
        onCancel={cancelModal}
        cancelText="取消"
        okText="确定"
      >
        {recordList?.map((item, i) => {
          return (
            <div key={i}>
              <span>
                [{item.createTime}]{item.description}
              </span>
              {item.remark && <span>{item.remark}</span>}
            </div>
          );
        })}
      </Modal>
    </Card>
  );
};
