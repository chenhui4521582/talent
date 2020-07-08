import React from 'react';
import {
  Card,
  Form,
  Select,
  Row,
  Col,
  Divider,
  notification,
  Modal,
} from 'antd';
import { Link } from 'umi';
import { ColumnProps } from 'antd/es/table';
import { queryDemand, IDemandParams, closeDemand } from './services/list';
import { useTabTable } from '@/components/GlobalTable/useTabTable';
import { useBusiness, useJob } from '@/models/global';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const columns: ColumnProps<IDemandParams>[] = [
    {
      title: '编号',
      dataIndex: 'demandId',
      key: 'demandId',
      align: 'center',
    },
    {
      title: '业务线',
      dataIndex: 'businessLineName',
      key: 'businessLineName',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: (text, record) => {
        return (
          <span>
            {record.actualAmount}/{text}
          </span>
        );
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'emergencyDegree',
      key: 'emergencyDegree',
      align: 'center',
      render: text => {
        const data = { 1: '一般', 2: '中等', 3: '紧急' };
        return (
          <span style={text === 3 ? { color: 'red' } : {}}>{data[text]}</span>
        );
      },
    },
    {
      title: '处理人',
      dataIndex: 'hrName',
      key: 'hrName',
      align: 'center',
    },
    {
      title: '过期时间',
      dataIndex: 'entryDate',
      key: 'entryDate',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: text => {
        const data = { 1: '已创建', 2: '进行中', 3: '已结束' };
        return <span>{data[text]}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link to={`/talent/recruit/show/${record.demandId}`}>查看</Link>
            <span style={{ display: record.status === 3 ? 'none' : '' }}>
              <Divider type="vertical" />
              <Link to={`/talent/recruit/edit/${record.demandId}`}>
                <span>修改</span>
              </Link>
              <Divider type="vertical" />
              <a onClick={e => handleDelete(record)}>终止</a>
            </span>
          </span>
        );
      },
    },
  ];
  const handleDelete = (record: IDemandParams) => {
    Modal.confirm({
      title: '确认终止需求吗?',
      okText: '确定',
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await closeDemand(record.demandId);
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
  const { TableContent, refresh } = useTabTable({
    queryMethod: queryDemand,
    columns,
    paramName: 'status',
    defaultValue: '1',
    tabData: [
      {
        name: '已创建',
        value: '1',
      },
      {
        name: '进行中',
        value: '2',
      },
      {
        name: '已终止',
        value: '3',
      },
    ],
    rowKeyName: 'demandId',
    cacheKey: 'demand/listAllDemand',
  });
  return (
    <Card title="需求列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="业务线" name="businessCode">
              <Select showSearch allowClear={true} optionFilterProp="children">
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
          <Col span={6} offset={2}>
            <Form.Item label="岗位" name="positionId">
              <Select showSearch allowClear={true} optionFilterProp="children">
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
            <Form.Item label="紧急程度" name="emergencyDegree">
              <Select showSearch allowClear={true} optionFilterProp="children">
                <Option value="1">一般</Option>
                <Option value="2">中等</Option>
                <Option value="3">紧急</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
