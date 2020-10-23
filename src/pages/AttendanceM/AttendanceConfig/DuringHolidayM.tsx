// 假期管理
import React, { useState } from 'react';
import {
  Card,
  notification,
  Modal,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
} from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { ColumnProps } from 'antd/es/table';
import {
  listHolidayConfig,
  updateHolidayConfig,
} from './services/globalConfig';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select;

export default () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: '60px',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '说明',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: '26vw',
    },
    {
      title: '最小休假时长',
      dataIndex: 'minUnit',
      key: 'minUnit',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            {record.unit === 1 ? record.min + '天' : record.min + '小时'}
          </span>
        );
      },
    },
    {
      title: '最大休假时长',
      dataIndex: 'maxUnit',
      key: 'maxUnit',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            {record.unit === 1 ? record.max + '天' : record.max + '小时'}
          </span>
        );
      },
    },
    {
      title: '计算休假方式',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      render: (_, record) => {
        return <span>{record.type === 1 ? '工作日' : '自然日'}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <a
          onClick={() => {
            handleEdit(record);
          }}
        >
          修改
        </a>
      ),
    },
  ];

  const { TableContent, refresh } = useReq({
    queryMethod: listHolidayConfig,
    columns,
    rowKeyName: 'typeId',
    cacheKey: '/attendance/holidayConfig/listHolidayConfig',
  });

  const handleEdit = record => {
    let value = {
      typeId: record.typeId,
      name: record.name,
      remark: record.remark,
      min: record.min,
      max: record.max,
      unit: record.unit,
      type: record.type,
    };
    form.setFieldsValue(value);
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async value => {
      let obj = {
        typeId: value.typeId,
        name: value.name,
        remark: value.remark,
        min: value.min,
        unit: value.unit,
        max: value.max,
        type: value.type,
      };
      let res: GlobalResParams<string> = await updateHolidayConfig(obj);
      if (res.status === 200) {
        notification['success']({
          message: res.msg,
          description: '',
        });
        setVisible(false);
        refresh();
      } else {
        notification['error']({
          message: res.msg,
          description: '',
        });
      }
    });
  };
  return (
    <Card title="假期管理">
      <TableContent />

      <Modal
        title="修改"
        visible={visible}
        okText="确认"
        cancelText="取消"
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form}>
          <Form.Item name="typeId" label="名称" style={{ display: 'none' }}>
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input placeholder="请输入备注" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="说明"
            rules={[{ required: true, message: '请输入!' }]}
          >
            <Input.TextArea
              placeholder="请输入名称"
              style={{ height: '12vh' }}
            />
          </Form.Item>
          <Form.Item
            name="min"
            label="最小休假"
            rules={[{ required: true, message: '请输入!' }]}
          >
            <InputNumber placeholder="请输入" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="max"
            label="最大休假"
            rules={[{ required: true, message: '请输入!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入"
              // style={{ width: 120, marginRight: 20 }}
            />
          </Form.Item>
          <Form.Item
            name="unit"
            label="请假单位"
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Select
              placeholder="请选择"
              // style={{ width: 120, marginRight: 20 }}
            >
              <Option value={0}>小时</Option>
              <Option value={1}>天</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="计算休假方式"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Select placeholder="请选择">
              <Option value={2}>自然日</Option>
              <Option value={1}>工作日</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
