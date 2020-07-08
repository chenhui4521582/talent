import React, { useState } from 'react';
import { Card, Form, notification, Modal, Button, Input, Divider } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { ColumnProps } from 'antd/es/table';
import { listJobPage, saveJob, updateJob, removeJob } from './services/job';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  const [jobId, setJobId] = useState<number>();
  const [action, setAction] = useState<string>('');
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      key: 'jobId',
      dataIndex: 'jobId',
    },
    {
      title: '岗位名称',
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
          <a onClick={e => showModal('edit', record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={e => handleDelete(record)}>删除</a>
        </span>
      ),
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: listJobPage,
    columns,
    rowKeyName: 'jobId',
    cacheKey: 'job/listJobPage',
  });

  const showModal = (type, record) => {
    setJobId(record?.jobId);
    setAction(type);
    form.setFieldsValue({ positionName: record?.jobName });
  };

  const cancelModal = () => {
    setJobId(undefined);
    setAction('');
    form.resetFields();
  };

  const handleDelete = record => {
    Modal.confirm({
      title: '确定删除该岗位?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await removeJob(record.jobId);
        if (res.status === 200) {
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
      },
    });
  };

  const handleAdd = async values => {
    let actionMethod;
    if (action === 'add') {
      actionMethod = saveJob;
    } else {
      actionMethod = updateJob;
      values.positionId = jobId;
    }
    let res: GlobalResParams<string> = await actionMethod(values);
    if (res.status === 200) {
      cancelModal();
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
  };
  return (
    <Card
      title="岗位管理"
      extra={
        <Button type="primary" onClick={e => showModal('add', undefined)}>
          新增岗位
        </Button>
      }
    >
      <TableContent />
      <Modal
        visible={!!action}
        title={action === 'add' ? '新增岗位' : '编辑岗位'}
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => form.submit()}
      >
        <Form form={form} onFinish={handleAdd}>
          <Form.Item
            label="岗位名称"
            name="positionName"
            rules={[{ required: true, message: '请输入岗位名称' }]}
          >
            <Input placeholder="请输入岗位名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
