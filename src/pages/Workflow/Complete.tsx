import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, DatePicker, Input, Select } from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { myDoneListPage, tsList } from './services/home';
import {
  categoryList,
  tsCategoryItem,
} from '@/pages/WFmanage/services/category';
import { Link } from 'umi';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
const { Option } = Select;
const status = {
  '-1': '删除',
  '0': '已撤销',
  '1': '审批中',
  '2': '已通过',
  '3': '已驳回',
};

export default () => {
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
  const columns: ColumnProps<tsList>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },

    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record: tsList) => <span>{status[record.status]}</span>,
    },
    {
      title: '当前节点',
      dataIndex: 'currStepStr',
      key: 'currStepStr',
      align: 'center',
    },
    {
      title: '未操作者',
      dataIndex: 'dealUser',
      key: 'dealUser',
      align: 'center',
      width: '15vw',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: tsList) => (
        <Link to={`detail/${record.id}`}>点击查看</Link>
      ),
    },
  ];

  const { TableContent, refresh } = useTable({
    queryMethod: myDoneListPage,
    columns,
    rowKeyName: 'id',
    cacheKey: 'wftaskform/listDoneFormPage',
  });

  return (
    <Card title="已办流程">
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="开始时间" name="createTimeStart">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="结束时间" name="createTimeEnd">
              <DatePicker format="YYYY-MM-DD" placeholder="请选择" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="categoryId">
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
          <Col span={5} offset={1}>
            <Form.Item label="审批状态" name="status">
              <Select placeholder="请选择" allowClear>
                <Option value="0">已撤销</Option>
                <Option value="1">审批中</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <Form.Item label="审批编号" name="formNumber">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="申请人" name="createUserName">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="关键字" name="title">
              <Input placeholder="搜索标题" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
