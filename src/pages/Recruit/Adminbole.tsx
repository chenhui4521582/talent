import React, { useState } from 'react';
import {
  Card, Form, Select, Row, Col, notification, Modal, Table
} from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { useBusiness, useJob } from '@/models/global';
import { queryAdminBole, IBoleTableItem, removeBole, queryBoleHire, IBoleHireItem } from './services/bole';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
export default (props) => {
  const { businessList } = useBusiness();
  const { jobList } = useJob();
  const [visible, setVisible] = useState<boolean>(false);
  const [boleData, setBoleData] = useState<IBoleHireItem[]>([]);
  const columns: ColumnProps<IBoleTableItem>[] = [{
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
    title: '进度',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
    render: (text, record) => {
      return <span>{record.actualAmount}/{text}</span>
    }
  }, {
    title: '星级',
    dataIndex: 'boleLevel',
    key: 'boleLevel',
    align: 'center',
  }, {
    title: '奖励',
    dataIndex: 'boleReward',
    key: 'boleReward',
    align: 'center',
    render: (text) => {
      return <span>{text}元</span>
    }
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
    title: '推荐录用情况',
    dataIndex: 'boleHireNumber',
    key: 'boleHireNumber',
    align: 'center',
    render: (text, record) => {
      return <a onClick={e => showModal(record.demandId)}>{text}/{record.boleRecommendNumber}</a>
    }
  }, {
    title: '截止时间',
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center'
  }, {
    title: '链接',
    dataIndex: 'boleLink',
    key: 'boleLink',
    align: 'center'
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => {
      if (record.status === 1) {
        return(
          <a onClick={e => handleRemoveBole(record.demandId)}>撤销</a>
        )
      } else {
        return null;
      }
    }
  }];

  const bole_columns: ColumnProps<IBoleHireItem>[] = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    align: 'center'
  }, {
    title: '简历附件',
    dataIndex: 'resumeLink',
    key: 'resumeLink',
    align: 'center',
    render: (text) => {
      return <a download href={text}>{text}</a>
    }
  }, {
    title: '推荐人',
    dataIndex: 'recommendName',
    key: 'recommendName',
    align: 'center'
  }, {
    title: '面试情况',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (text) => {
      const data = { 0: '面试不通过', 1: '待沟通', 2: '待面试', 3: '待录用', 4: '已录用', 5: '拒绝面试', 6: '已入职', 7: '未入职' };
      return <span>{data[text]}</span>
    }
  }, {
    title: '入职时间',
    dataIndex: 'entryDate',
    key: 'entryDate',
    align: 'center',
  }]

  const { TableContent, refresh } = useTable({
    queryMethod: props.queryMethod ? props.queryMethod : queryAdminBole,
    columns,
    rowKeyName: 'demandId'
  });

  const handleRemoveBole = async (demandId: number) => {
    Modal.confirm({
      title: '你确定要撤销此伯乐奖吗?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await removeBole(demandId);
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
      }
    });
  };
  const showModal = async (demandId: number) => {
    let res: GlobalResParams<IBoleHireItem[]> = await queryBoleHire(demandId);
    setBoleData(res.obj);
    setVisible(true);
  };

  const closeModal = () => {
    setBoleData([]);
    setVisible(false);
  }
  return (
    <Card title="伯乐奖管理">
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
              label="状态"
              name="status"
            >
              <Select
                showSearch
                allowClear={true}
                optionFilterProp="children"
              >
                <Option value="1">已创建</Option>
                <Option value="2">进行中</Option>
                <Option value="3">已结束</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        width={1000}
        visible={visible}
        title="推荐录用情况"
        onOk={closeModal}
        onCancel={closeModal}
        okText="确定"
        cancelText="取消"
      >
        <Table
          size="small"
          bordered
          rowKey='name'
          dataSource={boleData}
          columns={bole_columns}
        />
      </Modal>
    </Card>
  )
}