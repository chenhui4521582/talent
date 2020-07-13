import React from 'react';
import {
  Card,
  Modal,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  notification,
} from 'antd';
import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';
import { useTable } from '@/components/GlobalTable/useTable';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { historyList, deleteHistory, tsList } from './services/history';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;
const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: '审批编号',
      dataIndex: 'formNumber',
      key: 'formNumber',
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '工作流',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '申请人',
      dataIndex: 'applyTruename',
      key: 'applyTruename',
      align: 'center',
    },
    {
      title: '申请人部门',
      dataIndex: 'applyDepartmentName',
      key: 'applyDepartmentName',
      align: 'center',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return <span>{status[record.status]}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <a onClick={e => handlePrint(record.id)}>删除</a>
          </span>
        );
      },
    },
  ];

  const { TableContent, refresh } = useTable({
    queryMethod: historyList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/taskFormListByCondition',
  });
  const handlePrint = (id: string) => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await deleteHistory(id);
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
    <Card title="应聘登记表">
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="开始时间" name="startDate">
              <DatePicker format="YYYY-MM-DD" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="结束时间" name="endDate">
              <DatePicker format="YYYY-MM-DD" placeholder="" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="taskType">
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="所属部门" name="businessCode">
              <OzTreeSlect onlySelect={true} onlySelectLevel={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item label="审批状态" name="status">
              <Select>
                <Option value="-1">删除</Option>
                <Option value="0">已撤销</Option>
                <Option value="1">审批中</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="审批编号" name="formNumber">
              <Input />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请人" name="applicant">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
