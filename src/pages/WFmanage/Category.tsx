import React, { useState, useEffect } from 'react';
import { Card, Button, Divider, notification, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useReq } from '@/components/GlobalTable/useReq';
import { GlobalResParams } from '@/types/ITypes';
import {
  categoryList,
  deleteCategory,
  saveCategory,
  updateCategory,
} from './services/category';
import { ColumnProps } from 'antd/es/table';

interface tsList {
  id: string;
  name: string;
  remark: number;
}
const { TextArea } = Input;

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '当前状态',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a
              onClick={() => {
                setAction('change');
              }}
            >
              修改
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                handleDelete(record.id);
              }}
            >
              删除
            </a>
          </span>
        );
      },
    },
  ];
  const [action, setAction] = useState<'add' | 'change'>();
  const [form] = Form.useForm();
  const { TableContent, refresh } = useReq({
    queryMethod: categoryList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wfResFormCategory/getCategoryList',
  });

  const handAction = (record: tsList, type: 'add' | 'change') => {
    setAction(type);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '该审批流程的所有记录将被删除，且不可恢复，确认删除？',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await deleteCategory(id);
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

  return (
    <Card
      title="工作流类别管理"
      extra={
        <Button
          onClick={() => {
            setAction('add');
          }}
          type="primary"
        >{`新增类别`}</Button>
      }
    >
      <TableContent />
      <Modal
        title={action === 'add' ? '新增工作流类别' : '修改工作流类别'}
        visible={!!action}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setAction(undefined);
        }}
        onOk={() => {
          setAction(undefined);
        }}
      >
        <Form form={form}>
          <Form.Item
            label="类别名称"
            name="name"
            rules={[{ required: true, message: '请输入类别名称!' }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
          <Form.Item label="类别描述" name="remark">
            <TextArea placeholder="类别名称" rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
