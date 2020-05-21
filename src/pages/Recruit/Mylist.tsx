import React from 'react';
import {
  Card, Form, Select, Row, Col
} from 'antd';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { useBusiness, useJob } from '@/models/global';
import { queryMyDemand, IMyDemand } from './services/mylist';
import { ColumnProps } from 'antd/es/table';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const columns: ColumnProps<IMyDemand>[] = [{
    title: '编号',
    dataIndex: 'demandId',
    key: 'demandId',
    align: 'center'
  }, {
    title: '业务线',
    dataIndex: 'businessLineName',
    key: 'businessLineName',
    align: 'center'
  }, {
    title: '岗位',
    dataIndex: 'jobName',
    key: 'jobName',
    align: 'center'
  }, {
    title: '数量',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
    render: (text, record) => {
      return <span>{record.actualAmount}/{text}</span>
    }
  }, {
    title: '紧急程度',
    dataIndex: 'emergencyDegree',
    key: 'emergencyDegree',
    align: 'center',
    render: (text) => {
      const data = {1: '一般', 2: '中等', 3: '紧急'};
      return <span style={text===3 ? {color: 'red'} : {}}>{data[text]}</span>
    }
  }, {
    title: '处理人',
    dataIndex: 'hrName',
    key: 'hrName',
    align: 'center'
  }, {
    title: '入职时间',
    dataIndex: 'entryDate',
    key: 'entryDate',
    align: 'center'
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (text) => {
      const data = {1: '已创建', 2: '进行中', 3: '已结束'};
      return <span>{data[text]}</span>
    }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center'
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return(
        <span>
          <Link to={`/talent/recruit/show/${record.demandId}?task=1`}>
            查看
          </Link>
        </span>
      )
    }
  }];
  const { TableContent } = useTable({
    queryMethod: queryMyDemand,
    columns,
    rowKeyName: 'demandId'
  });
  return (
    <Card title="我的需求">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="业务线"
              name="businessId"
            >
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
              >
                {businessList?.map((item) => {
                  return <Option key={item.businessId} value={item.businessId}>{item.businessLineName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="岗位"
              name="positionId"
            >
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
              >
                {jobList?.map((item) => {
                  return <Option key={item.jobId} value={item.jobId}>{item.jobName}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="紧急程度"
              name="emergencyDegree"
            >
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
              >
                <Option value="1">一般</Option>
                <Option value="2">中等</Option>
                <Option value="3">紧急</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              label="状态"
              name="status"
            >
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
              >
                <Option value="2">进行中</Option>
                <Option value="3">已结束</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  )
}