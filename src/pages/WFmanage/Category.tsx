import React, { useState } from 'react';
import { Card, notification, Modal, Button, Divider, Form, Input } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { categoryList, tsCategoryItem } from './services/category';

import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  const [categoryId, setCategory] = useState<number>();
  const [action, setAction] = useState<string>('');
  const [defaultValue, setDefaultValue] = useState<string>();
  const [form] = Form.useForm();

  const columns: ColumnProps<tsCategoryItem>[] = [
    {
      title: '类别名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '类别描述',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: tsCategoryItem) => (
        <span>
          <a onClick={e => showModal('edit', record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={e => handleDelete(record)}>删除</a>
        </span>
      ),
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: categoryList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wfresform/list',
  });

  const showModal = (
    type: string,
    record: tsCategoryItem | undefined,
  ): void => {
    setDefaultValue(record?.name);
    setCategory(record?.id);
    setAction(type);
  };

  const cancelModal = (): void => {
    setCategory(undefined);
    setAction('');
  };

  const handleDelete = (record: tsCategoryItem): void => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await removeCost(record.id);
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

  // const handleAdd = async (values: tsCategoryItem) => {
  //   let actionMethod;
  //   if (action === 'add') {
  //     actionMethod = saveCost;
  //   } else {
  //     actionMethod = updateCost;
  //     values.id = costId;
  //   }
  //   let res: GlobalResParams<string> = await actionMethod(values);
  //   if (res.status === 200) {
  //     cancelModal();
  //     refresh();
  //     notification['success']({
  //       message: res.msg,
  //       description: '',
  //     });
  //   } else {
  //     notification['error']({
  //       message: res.msg,
  //       description: '',
  //     });
  //   }
  // };

  return (
    <Card
      title="成本中心列表"
      extra={
        <Button type="primary" onClick={e => showModal('add', undefined)}>
          +新增类别
        </Button>
      }
    >
      <TableContent />
      <Modal
        visible={!!action}
        title={action === 'add' ? '新增工作流类别' : '编辑工作流类别'}
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={() => {
          alert(1);
        }}
      >
        <Form>
          <Form.Item name="name" label="类别名称">
            <Input placeholder="请输入类别名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
