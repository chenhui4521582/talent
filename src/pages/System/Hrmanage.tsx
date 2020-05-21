import React, { useState } from 'react';
import {
  Card, Form, Row, Col, Select, Switch, notification, Modal, Button, Radio
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { getRoleList, updateRole, addRole } from './services/role';
import { GlobalResParams } from '@/types/ITypes';
import { useBusiness } from '@/models/global';
import { listUserByBusinessCode, IBusinessPerson } from '@/services/global';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const [visible, setVisible] = useState<boolean>(false);
  const [persons, setPersons] = useState<IBusinessPerson[]>();
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      key: 'userNo',
      dataIndex: 'userNo'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const data = { 1: '人事专员', 2: '面试官' };
        return <span>{data[text]}</span>
      }
    },
    {
      title: '业务线',
      dataIndex: 'businessLineName',
      key: 'businessLineName',
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email'
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        return <Switch checked={text === '1' ? true : false} onClick={e => changeStatus(record)} />
      }
    },
  ];
  const changeStatus = async (record) => {
    let status;
    if (record.status === '0') {
      status = '1'
    } else {
      status = '0';
    }
    let res: GlobalResParams<string> = await updateRole(record.userNo, status);
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
  };
  const { TableContent, refresh } = useTable({
    queryMethod: getRoleList,
    columns,
    rowKeyName: 'userNo'
  });

  const showModal = () => {
    setVisible(true);
  }
  const cancelModal = () => {
    setVisible(false);
    form.resetFields();
  }
  const changeBusiness = async (value) => {
    let data = JSON.parse(value);
    let res: GlobalResParams<IBusinessPerson[]> = await listUserByBusinessCode(data.businessId);
    setPersons(res.obj);
  }

  const handleAdd = async (values) => {
    let businessData = JSON.parse(values.businessId);
    let userData = JSON.parse(values.userCode);
    values.userCode = userData.userCode;
    values.email = userData.email;
    values.name = userData.userName;
    values.businessLineName = businessData.businessLineName;
    values.businessId = businessData.businessId;
    let res: GlobalResParams<string> = await addRole(values);
    if(res.status === 200) {
      cancelModal();
      refresh();
      notification['success']({
        message: res.msg,
        description: '',
      });
    }else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  }
  return (
    <Card title="人员管理" extra={<Button type="primary" onClick={showModal}>新增人员</Button>}>
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="角色"
              name="type"
            >
              <Select>
                <Option value={1}>人事专员</Option>
                <Option value={2}>面试官</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={visible}
        title='新增人员'
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleAdd}
        >
          <Form.Item
            label="选择业务线"
            name="businessId"
            rules={[{ required: true, message: '请选择业务线' }]}
          >
            <Select placeholder="请选择业务线" allowClear onChange={changeBusiness}>
              {
                businessList?.map(item => {
                  return <Option key={item.businessId} value={JSON.stringify(item)}>{item.businessLineName}</Option>
                })
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="选择相关人员"
            name="userCode"
            rules={[{ required: true, message: '请选择相关人员' }]}
          >
            <Select placeholder="请选择相关人员">
              {
                persons?.map(item => {
                  return <Option key={item.userCode} value={JSON.stringify(item)}>{item.userName}</Option>
                })
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="角色"
            name="type"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Radio.Group>
              <Radio value="1">人事专员</Radio>
              <Radio value="2">面试官</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}