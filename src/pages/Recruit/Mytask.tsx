import React, { useState } from 'react';
import {
  Card,
  Form,
  Select,
  Row,
  Col,
  Divider,
  Modal,
  InputNumber,
  notification,
} from 'antd';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { useBusiness, useJob } from '@/models/global';
import { queryTask, IMyTask } from './services/mytask';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
import { setBole } from './services/bole';

const { Option } = Select;
export default () => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const [curRecord, setCurRecord] = useState<IMyTask | undefined>(undefined);
  const [boleForm] = Form.useForm();
  const columns: ColumnProps<IMyTask>[] = [
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
            <Link to={`/talent/recruit/show/${record.demandId}?task=2`}>
              查看
            </Link>
            <Divider type="vertical" />
            <a onClick={e => showBole(record)}>设置伯乐奖</a>
          </span>
        );
      },
    },
  ];
  const { TableContent } = useTable({
    queryMethod: queryTask,
    columns,
    rowKeyName: 'demandId',
    cacheKey: 'demand/listMyDemand',
  });
  const showBole = (record: IMyTask) => {
    setCurRecord(record);
  };
  const canceModal = () => {
    setCurRecord(undefined);
    boleForm.resetFields();
  };
  const handleSubmitBole = async values => {
    values.demandId = curRecord?.demandId;
    let res: GlobalResParams<string> = await setBole(values);
    if (res.status === 200) {
      notification['success']({
        message: res.msg,
        description: '',
      });
      canceModal();
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };
  return (
    <Card title="我的任务">
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
        <Row>
          <Col span={6}>
            <Form.Item label="状态" name="status">
              <Select showSearch allowClear={true} optionFilterProp="children">
                <Option value="2">进行中</Option>
                <Option value="3">已结束</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={!!curRecord}
        title="伯乐奖设置"
        onOk={_ => boleForm.submit()}
        onCancel={canceModal}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical" form={boleForm} onFinish={handleSubmitBole}>
          <Form.Item
            label="设置星级"
            name="boleLevel"
            rules={[{ required: true, message: '请设置星级' }]}
          >
            <Select placeholder="请设置星级">
              {[1, 2, 3, 4, 5].map(item => {
                return (
                  <Select.Option key={item} value={item}>
                    {item}星
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="奖励金额"
            name="boleReward"
            rules={[{ required: true, message: '请填写奖励金额' }]}
          >
            <InputNumber
              placeholder="请填写奖励金额"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
