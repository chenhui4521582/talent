import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Divider,
  Switch,
  notification,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import { Link } from 'umi';

import { useReq } from '@/components/GlobalTable/useReq';
import { homeList, changeState, save } from './services/new';
import { categoryList, tsCategoryItem } from './services/category';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';

interface tsList {
  id: number;
  name: string;
  status: number;
}

const { Option } = Select;

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
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={!!record.status}
            onChange={() => {
              onChange(record.id);
            }}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link to={`applicationrecord/${record.id}`}>申请记录</Link>
            <Divider type="vertical" />
            <Link to={`editForm/${record.id}`}>表单设置</Link>
            <Divider type="vertical" />
            <Link to={`editRule/${record.id}`}>规则设置</Link>
          </span>
        );
      },
    },
  ];

  const [type, setType] = useState<'add' | 'change'>();
  const [form] = Form.useForm();
  const [category, setCategory] = useState<tsCategoryItem[]>();

  useEffect(() => {
    async function getCategoryList() {
      let json: GlobalResParams<tsCategoryItem[]> = await categoryList();
      if (json.status === 200) {
        setCategory(json.obj);
      }
    }
    getCategoryList();
  }, []);

  const onChange = async id => {
    let res: GlobalResParams<string> = await changeState(id);
    if (res.status === 200) {
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

  const { TableContent, refresh } = useReq({
    queryMethod: homeList,
    columns,
    rowKeyName: 'id',
    cacheKey: '/wfresform/getList',
  });

  const handleOk = () => {
    form.validateFields().then(async value => {
      let json: GlobalResParams<string> = await save(value);
      if (json.status === 200) {
        refresh();
        setType(undefined);
        notification['success']({
          message: json.msg,
          description: '',
        });
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  return (
    <Card
      title="工作流列表"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setType('add');
          }}
        >{`新增工作流`}</Button>
      }
    >
      <TableContent />
      <Modal
        title={type === 'add' ? '新增工作流' : '修改工作流'}
        visible={!!type}
        okText="确定"
        cancelText="取消"
        key={type + ''}
        onCancel={() => {
          setType(undefined);
        }}
        onOk={handleOk}
      >
        <Form form={form}>
          <Form.Item
            label="工作流名称"
            name="name"
            rules={[{ required: true, message: '请输入工作流名称!' }]}
          >
            <Input placeholder="请输入用户名称" />
          </Form.Item>
          <Form.Item
            label="所属类别"
            name="formCategoryId"
            rules={[{ required: true, message: '请选择工作流类别!' }]}
          >
            <Select>
              {category?.map(item => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
