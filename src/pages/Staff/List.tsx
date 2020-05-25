import React from 'react';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { listByConditionsRoster } from './services/staff';
import {
  Card, Form, Input, Select, Row, Col, Button, Divider
} from 'antd';
import { useBusiness } from '@/models/global'; 
import { serialize } from '@/utils/serialize';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const columns: ColumnProps<any>[] = [{
    title: '员工编号',
    dataIndex: 'employeeId',
    key: 'employeeId',
    align: 'center'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  }, {
    title: '所属业务',
    dataIndex: 'businessName',
    key: 'businessName',
    align: 'center'
  }, {
    title: '成本中心',
    dataIndex: 'businessCostCenter',
    key: 'businessCostCenter',
    align: 'center'
  }, {
    title: '岗位',
    dataIndex: 'post',
    key: 'post',
    align: 'center'
  }, {
    title: '用工类型',
    dataIndex: 'employmentType',
    key: 'employmentType',
    align: 'center',
    render: (text) => {
      const data = { 1: '正式', 2: '实习', 3: '外聘', 4: '兼职' };
      return <span>{data[text]}</span>
    }
  }, {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
    align: 'center'
  }, {
    title: '合同起始日期',
    dataIndex: 'contractStart',
    key: 'contractStart',
    align: 'center'
  }, {
    title: '合同结束日期',
    dataIndex: 'contractEnd',
    key: 'contractEnd',
    align: 'center'
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      return(
        <span>
          <Link to={`detail?employeeId=${record.employeeId}&resumeId=${record.resumeId}`}>查看详情</Link>
          <Divider type="vertical" />
          <Link to={`edit?employeeId=${record.employeeId}`}>编辑</Link>
        </span>
      )
    }
  }];
  const { TableContent, searchForm } = useTable({
    queryMethod: listByConditionsRoster,
    columns,
    rowKeyName: 'employeeId',
  });
  return (
    <Card title="员工花名册" extra={
      <div>
      <Button type="primary"><Link to={`edit`}>新增员工</Link></Button>
      <Button download href={serialize('/api/talent/employeeRoster/export', searchForm.getFieldsValue())} style={{marginLeft: 10}}>导出</Button>
      </div>
    }>
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="岗位"
              name="post"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="员工编号"
              name="employeeId"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="姓名"
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              label="联系电话"
              name="mobile"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item
              label="业务线"
              name="businessId"
            >
              <Select showSearch optionFilterProp="children">
                {
                  businessList?.map(item => {
                    return <Option key={item.businessId} value={item.businessId}>{item.businessLineName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  )
}