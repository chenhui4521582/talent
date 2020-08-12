import React, { useMemo, useEffect, useState } from 'react';
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
  Cascader,
  Button,
} from 'antd';
import OzTreeSlect from '@/pages/Framework/components/OzTreeSlect';
import { useTable } from '@/components/GlobalTable/useTable';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { historyList, deleteHistory, tsList } from './services/history';
import { categoryList, tsCategoryItem } from './services/category';
import { useOrganization } from '@/models/global';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;
const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

interface tsListItem {
  label: string;
  value: string;
  children?: tsListItem[];
}

export default props => {
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
  const { organizationJson } = useOrganization();
  const [dataList, setDataList] = useState<tsListItem[]>([]);
  const [list, setList] = useState<tsCategoryItem[]>();

  useEffect(() => {
    async function getCategoryList() {
      let res: GlobalResParams<tsCategoryItem[]> = await categoryList();
      if (res.status === 200) {
        setList(res.obj);
      }
    }
    getCategoryList();
  }, []);

  useEffect(() => {
    handleList(organizationJson);
  }, [organizationJson]);

  const handleList = data => {
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].code;
        list[i].label = list[i].name;
        if (list[i].level === 3) {
          delete list[i].children;
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    handleItem(data);
    setDataList(data);
  };

  const { TableContent, refresh } = useTable({
    queryMethod: historyList,
    columns,
    rowKeyName: 'id',
    cacheKey:
      'wftaskform/taskFormListByCondition' + props.match.params.id || '',
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
    <Card
      title="工作流列表/申请记录"
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.history.go(-1);
          }}
        >
          返回
        </Button>
      }
    >
      <TableContent>
        <Row>
          <Col span={5} style={{ display: 'none' }}>
            <Form.Item
              label="id"
              name="id"
              initialValue={parseInt(props.match.params.id)}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="开始时间" name="startDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="结束时间" name="endDate">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="所属部门" name="departmentCode">
              <Cascader options={dataList} placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="taskType">
              <Select placeholder="请选择" allowClear>
                {list?.map((item, i) => {
                  return (
                    <Option key={i} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item label="审批状态" name="status">
              <Select placeholder="请选择" allowClear>
                <Option value="0">已撤销</Option>
                <Option value="1">审批中</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="审批编号" name="formNumber">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请人" name="applicant">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
