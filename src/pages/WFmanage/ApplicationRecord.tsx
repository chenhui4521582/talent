import React, { useEffect, useState } from 'react';
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
import { categoryList } from './services/category';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;
const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

interface tsCategory {
  id: number;
  name: string;
}

export default () => {
  const [cList, setCategoryList] = useState<tsCategory[]>([]);

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

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    let res: GlobalResParams<tsCategory[]> = await categoryList();
    if (res.status === 200) {
      setCategoryList(res.obj);
    }
  };

  const { TableContent, refresh } = useTable({
    queryMethod: historyList,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/taskFormListByCondition',
  });
  const handlePrint = (id: string) => {
    Modal.confirm({
      title: '该审批流程的所有记录将被删除，且不可恢复，确认删除？',
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
    <Card title="工作流列表/申请记录">
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="开始时间" name="startDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="结束时间" name="endDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="taskType">
              <Select placeholder="请选择">
                {cList.map(item => {
                  return <Option value={item.id}>{item.name}</Option>;
                })}
              </Select>
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
              <Select placeholder="请选择">
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
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请人" name="applicant">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
