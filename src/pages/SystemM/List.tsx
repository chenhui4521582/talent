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
import { useLevelOr } from '@/models/global';
import { useBusiness } from '@/models/global';
import { useJob } from '@/models/global';
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
    rowKeyName: 'userCode',
    cacheKey: 'talent/role/listUserRole',
    showCheck: true,
  });
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<tsRoles[]>();
  const [visible, setVisible] = useState<boolean>(false);
  const { jobList } = useJob();
  const { businessList } = useBusiness();
  useBusiness;

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
          <Col span={6}>
            <Form.Item label="岗位" name="postId">
              <Select showSearch optionFilterProp="children">
                {jobList?.map(item => {
                  return (
                    <Option key={item.jobId} value={item.jobId}>
                      {item.jobName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="员工编号" name="employeeId">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="业务线" name="businessCode">
              <Select showSearch optionFilterProp="children">
                {businessList?.map(item => {
                  return (
                    <Option key={item.businessCode} value={item.businessCode}>
                      {item.businessLineName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        title={'授权管理' + selectKeys.length}
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
