import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  notification,
  message,
  Button,
  Input,
  Form,
  Row,
  Col,
  Modal,
  Select,
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { list, roleList, updata, tsItem } from './servers/list';
import { GlobalResParams } from '@/types/ITypes';

import LevelOr from '@/components/GlobalTable/levelOr';

const sexHash = { 1: '男', 2: '女' };
const { Option } = Select;

interface tsRoles {
  name: string;
  code: string;
}

export default () => {
  const columns: ColumnProps<tsItem>[] = [
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
      render: (_, record) => {
        return <span>{sexHash[record.sex]}</span>;
      },
    },
    {
      title: '一级业务',
      dataIndex: 'firstBusinessName',
      key: 'firstBusinessName',
      align: 'center',
    },
    {
      title: '二级业务',
      dataIndex: 'businessName',
      key: 'businessName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      align: 'center',
    },
    {
      title: '组别',
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
    },
    {
      title: '技术岗位',
      dataIndex: 'postName',
      key: 'postName',
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
  ];

  const { TableContent, searchForm, selectKeys, refresh } = useTable({
    queryMethod: list,
    columns,
    rowKeyName: 'employeeId',
    cacheKey: 'talent/role/listUserRole',
    showCheck: true,
  });
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<tsRoles[]>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    async function getRolesApi() {
      let json: GlobalResParams<tsRoles[]> = await roleList();
      if (json.status === 200) {
        setRoles(json.obj);
      }
    }
    getRolesApi();
  }, []);

  const handleOk = () => {
    form.validateFields().then(async value => {
      value.userCodes = selectKeys.join(',');
      let json: GlobalResParams<string> = await updata(value);
      if (json.status === 200) {
        refresh();
        setVisible(false);
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

  const handleShow = () => {
    if (selectKeys?.length) {
      setVisible(true);
    } else {
      message.warning('请选择用户');
    }
  };

  const renderMadel = useMemo(() => {
    return roles?.map(item => {
      return <Option value={item.code}>{item.name}</Option>;
    });
  }, [roles]);

  return (
    <Card
      title="用户角色管理"
      extra={
        <Button onClick={handleShow} type="primary">
          用户授权
        </Button>
      }
    >
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="一级业务">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工号">
              <Input placeholder="输入工号" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="姓名" name="name">
              <Input placeholder="输入姓名" />
            </Form.Item>
          </Col>
          {/* <Col span={5} offset={1}>
            <Form.Item label="二级业务">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="部门">
              <LevelOr code="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="组别">
              <LevelOr code="" />
            </Form.Item>
          </Col> */}
        </Row>
      </TableContent>
      <Modal
        title="授权管理"
        okText="确认"
        cancelText="取消"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={handleOk}
      >
        <Form form={form}>
          <Form.Item label="角色" name="roleCode">
            <Select placeholder="请选择需要设置角色" allowClear>
              {renderMadel}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
