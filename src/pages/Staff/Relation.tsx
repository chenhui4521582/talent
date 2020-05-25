import React from 'react';
import { useTable } from '@/components/GlobalTable/useTable';
import { listFamily } from './services/staff';
import { Card, Form, Row, Col, Input, Select, Button } from 'antd';
import { useBusiness, useJob } from '@/models/global';
import { serialize } from '@/utils/serialize';

const { Option } = Select;

export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const columns = [
    {
      title: '员工编号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      align: 'center',
    },
    {
      title: '家庭信息',
      children: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          title: '与本人关系',
          dataIndex: 'relationship',
          key: 'relationship',
          align: 'center',
        },
        {
          title: '工作单位',
          dataIndex: 'company',
          key: 'company',
          align: 'center',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone',
          align: 'center',
        },
      ],
      // }, {
      //   title: '子女信息',
      //   children: [{
      //     title: '姓名',
      //     dataIndex: 'name',
      //     key: 'name',
      //     align: 'center'
      //   }, {
      //     title: '性别',
      //     dataIndex: 'name',
      //     key: 'name',
      //     align: 'center'
      //   }, {
      //     title: '出生日期',
      //     dataIndex: 'name',
      //     key: 'name',
      //     align: 'center'
      //   }]
    },
  ];
  const { TableContent, searchForm } = useTable({
    queryMethod: listFamily,
    columns: columns as any,
    rowKeyName: 'employeeId',
  });

  return (
    <Card
      title="家庭信息"
      extra={
        <Button
          type="primary"
          download
          href={serialize(
            `/api/talent/employeeRoster/exportFamily`,
            searchForm.getFieldsValue(),
          )}
        >
          导出数据
        </Button>
      }
    >
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="业务线" name="businessId">
              <Select showSearch optionFilterProp="children">
                {businessList?.map(item => {
                  return (
                    <Option key={item.businessId} value={item.businessId}>
                      {item.businessLineName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="部门" name="departmentId">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="岗位" name="postId">
              <Select>
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
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="员工编号" name="employeeId">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label="联系电话" name="mobile">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
