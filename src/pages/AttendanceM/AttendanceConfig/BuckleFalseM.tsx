// 统一扣假管理
import React, { useState, useEffect } from 'react';
import {
  Card,
  notification,
  Modal,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Table,
} from 'antd';
import { useReq } from '@/components/GlobalTable/useReq';
import { ColumnProps } from 'antd/es/table';
import {
  listHolidayConfig,
  listVacationRecord,
  saveVacationRecord,
} from './services/globalConfig';
import { GlobalResParams } from '@/types/ITypes';
import AddUserList from './components/AddUserList';

const { Option } = Select;

export default props => {
  const [visible, setVisible] = useState<boolean>(false);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [typeList, setTypeList] = useState<any[]>();
  const [form] = Form.useForm();
  const [userList, setUserList] = useState<any[]>();

  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: '60px',
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '扣假类型',
      dataIndex: 'typeId',
      key: 'typeId',
      align: 'center',
      render: (_, record) => {
        return typeList?.map(item => {
          if (item.typeId === record.typeId) return item.name;
        });
      },
    },
    {
      title: '扣假时长',
      dataIndex: 'changeNumber',
      key: 'changeNumber',
      align: 'center',
      render: (_, record) => {
        let str = '';
        if (record.unit === 0) {
          str = '小时';
        } else if (record.unit === 1) {
          str = '天';
        } else if (record.unit === 2) {
          str = '分钟';
        }
        return (
          <span>
            {record.changeNumber}
            {str}
          </span>
        );
      },
    },
    {
      title: '实际扣假人数',
      dataIndex: 'peopleNumber',
      key: 'peopleNumber',
      align: 'center',
      render: (_, record) => {
        return <span>{record.peopleNumber}人</span>;
      },
    },
    {
      title: '扣假说明',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <a
          onClick={() => {
            record?.member?.map(item => {
              item.date = record.date;
            });
            setList(record?.member);
            setVisible1(true);
          }}
        >
          人员明细
        </a>
      ),
    },
  ];

  useEffect(() => {
    async function getListType() {
      let json: GlobalResParams<any> = await listHolidayConfig();
      if (json.status === 200) {
        setTypeList(json.obj);
      }
    }
    getListType();
  }, []);

  const { TableContent, refresh } = useReq({
    queryMethod: listVacationRecord,
    columns,
    rowKeyName: 'recordId',
    cacheKey: '/attendance/vacation/listVacationRecord',
  });

  const handleOk = () => {
    form.validateFields().then(async value => {
      let member: any = [];
      userList?.map(item => {
        member.push({
          userCode: item.code,
          userName: item.name,
          organizationName: item.organizationName,
          employeeId: item.employeeId,
        });
      });

      let obj = {
        date: new Date(),
        unit: value.minObj.unit,
        changeNumber: value.minObj.changeNumber,
        description: value.description,
        typeId: value.typeId,
        member: member,
      };

      let res: GlobalResParams<string> = await saveVacationRecord(obj);
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

  const handleChangeUserList = value => {
    if (value) {
      let arr: any[] = [];
      value.map(item => {
        for (let key in item) {
          arr = arr.concat(item[key]);
        }
      });
      console.log(arr);
      setUserList(arr);
    }
  };

  return (
    <Card
      title="统一扣假管理"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          发起扣假
        </Button>
      }
    >
      <TableContent />

      <Modal
        title="发起扣假"
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
          <Form.Item
            label="打卡人员"
            name="memberList"
            rules={[{ required: true, message: '请输入用户名称!' }]}
            style={{
              marginBottom: 20,
              minHeight: '40px',
              overflowY: 'auto',
            }}
          >
            <AddUserList
              {...props}
              handleChangeUserList={handleChangeUserList}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="扣假说明"
            rules={[{ required: true, message: '请输入!' }]}
          >
            <Input.TextArea
              placeholder="请输入扣假说明"
              style={{ height: '12vh' }}
            />
          </Form.Item>

          <Form.Item
            name="typeId"
            label="扣假类型"
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Select style={{ width: 120 }}>
              {typeList?.map(item => {
                return (
                  <Option key={item.typeId} value={item.typeId}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="minObj" label="扣假时长">
            <Input.Group compact>
              <Form.Item
                noStyle
                name={['minObj', 'changeNumber']}
                rules={[{ required: true, message: '请输入!' }]}
              >
                <InputNumber
                  placeholder="请输入"
                  style={{ width: 120, marginRight: 20 }}
                />
              </Form.Item>
              <Form.Item
                noStyle
                name={['minObj', 'unit']}
                rules={[{ required: true, message: '请选择!' }]}
              >
                <Select style={{ width: 120 }}>
                  <Option value={0}>小时</Option>
                  <Option value={1}>天</Option>
                  <Option value={2}>分钟</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width="50vw"
        title="人员明细"
        visible={visible1}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          setVisible1(false);
        }}
        onCancel={() => {
          setVisible1(false);
        }}
      >
        <UserListTable list={list} />
      </Modal>
    </Card>
  );
};

const UserListTable = props => {
  const { list } = props;
  const columns: ColumnProps<any>[] = [
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '组织架构',
      key: 'organizationName',
      dataIndex: 'organizationName',
      align: 'center',
    },
    {
      title: '工号',
      key: 'employeeId',
      dataIndex: 'employeeId',
      align: 'center',
    },
    {
      title: '姓名',
      key: 'userName',
      dataIndex: 'userName',
      align: 'center',
    },
  ];
  return <Table columns={columns} dataSource={list} />;
};
