// 假期管理
import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: '26vw',
    },
    {
      title: '最小休假单位',
      dataIndex: 'minUnit',
      key: 'minUnit',
      align: 'center',
      render: (_, record) => {
        return <span>{record.minUnit === 1 ? record.min + '天' : '小时'}</span>;
      },
    },
    {
      title: '最大休假单位',
      dataIndex: 'maxUnit',
      key: 'maxUnit',
      align: 'center',
      render: (_, record) => {
        return <span>{record.maxUnit === 1 ? record.max + '天' : '小时'}</span>;
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
    rowKeyName: 'id',
    cacheKey: '/attendance/holidayConfig/listHolidayConfig',
  });

  const handleEdit = record => {
    let value = {
      typeId: record.typeId,
      name: record.name,
      remark: record.remark,
      minObj: {
        min: record.min,
        minUnit: record.minUnit,
      },
      maxObj: {
        max: record.max,
        maxUnit: record.maxUnit,
      },
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
        min: value.minObj.min,
        minUnit: value.minObj.minUnit,
        max: value.maxObj.max,
        maxUnit: value.maxObj.maxUnit,
      };
      let res: GlobalResParams<string> = await updateHolidayConfig(obj);
      if (res.status === 200) {
        notification['success']({
          message: res.msg,
          description: '',
        });
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
    <Card
      title="公告列表"
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.location.href = 'new';
          }}
        >
          新增公告
        </Button>
      }
    >
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
          <Form.Item name="minObj" label="最小单位">
            <Input.Group compact>
              <Form.Item
                noStyle
                name={['minObj', 'min']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  style={{ width: 120, marginRight: 20 }}
                />
              </Form.Item>
              <Form.Item
                noStyle
                name={['minObj', 'minUnit']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select style={{ width: 120 }}>
                  <Option value={0}>小时</Option>
                  <Option value={1}>天</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="maxObj" label="最小单位">
            <Input.Group compact>
              <Form.Item
                noStyle
                name={['maxObj', 'max']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  style={{ width: 120, marginRight: 20 }}
                />
              </Form.Item>
              <Form.Item
                noStyle
                name={['maxObj', 'maxUnit']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select style={{ width: 120 }}>
                  <Option value={0}>小时</Option>
                  <Option value={1}>天</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
