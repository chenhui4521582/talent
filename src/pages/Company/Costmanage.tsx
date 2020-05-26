import React, { useState, useRef } from 'react';
import { Card, notification, Modal, Button, Divider } from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { listPage, saveCost, updateCost, removeCost } from './services/cost';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Company from './components/Company';

export default () => {
  const [costId, setCostId] = useState<number>();
  const [action, setAction] = useState<string>('');
  const [optionName, setOptionName] = useState<number>();
  const companyRef = useRef<any>();

  const columns: ColumnProps<any>[] = [
    {
      title: '成本中心名称',
      key: 'costCenterName',
      dataIndex: 'costCenterName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
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
    queryMethod: listPage,
    columns,
    rowKeyName: 'id',
  });

  const showModal = (type, record) => {
    setOptionName(record?.costCenterName);
    setCostId(record?.id);
    setAction(type);
    companyRef.current?.reset();
  };

  const cancelModal = () => {
    setCostId(undefined);
    setAction('');
    companyRef.current.reset();
  };

  const handleDelete = record => {
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

  const handleAdd = async values => {
    let actionMethod;
    if (action === 'add') {
      actionMethod = saveCost;
    } else {
      actionMethod = updateCost;
      values.costId = costId;
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
      title="成本中心"
      extra={
        <Button type="primary" onClick={e => showModal('add', undefined)}>
          新增成本中心
        </Button>
      }
    >
      <TableContent />
      <Modal
        visible={!!action}
        title={action === 'add' ? '新增成本中心' : '编辑成本中心'}
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => companyRef.current.ok()}
      >
        <Company
          ref={companyRef}
          formRef={companyRef}
          handleAdd={handleAdd}
          optionName={optionName}
        />
      </Modal>
    </Card>
  );
};
