import React, { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import {
  Card,
  Button,
  Modal,
  Select,
  notification,
  Descriptions,
  Form,
} from 'antd';
import {
  demandDetail,
  IDemandDetail,
  deleteDemand,
  giveDemand,
} from './services/list';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRole } from '@/models/global';

export default props => {
  const demandId: number = props.match.params.id;
  const task = props.location.query.task;
  const [demand, setDemand] = useState<IDemandDetail>();
  const emergency_hash = { 1: '一般', 2: '中等', 3: '紧急' };
  const status_hash = { 1: '已创建', 2: '进行中', 3: '已结束' };
  const { roleList } = useRole(1);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    async function fetchDemand() {
      let res: GlobalResParams<IDemandDetail> = await demandDetail(demandId);
      setDemand(res.obj);
    }
    fetchDemand();
  }, []);
  const removeDemand = () => {
    Modal.confirm({
      title: '你确定要删除此需求吗?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await deleteDemand(demandId);
        if (res.status === 200) {
          history.push(`/talent/recruit/list`);
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

  const showModal = () => {
    setVisible(true);
  };

  const cancelModal = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSetHr = async values => {
    values.demandId = demandId;
    let res: GlobalResParams<string> = await giveDemand(values);
    if (res.status === 200) {
      cancelModal();
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
  };

  return (
    <Card title="需求详情" bordered={false}>
      <Descriptions size="middle" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="编号">{demand?.demandId}</Descriptions.Item>
        <Descriptions.Item label="业务线">
          {demand?.businessLineName}
        </Descriptions.Item>
        <Descriptions.Item label="岗位">{demand?.jobName}</Descriptions.Item>
        <Descriptions.Item label="职级">{demand?.rank}</Descriptions.Item>
        <Descriptions.Item label="数量">
          {demand?.actualAmount}/{demand?.amount}
        </Descriptions.Item>
        <Descriptions.Item label="过期时间">
          {demand?.entryDate}
        </Descriptions.Item>
        <Descriptions.Item label="紧急程度">
          {demand && emergency_hash[demand?.emergencyDegree]}
        </Descriptions.Item>
        <Descriptions.Item label="面试官">
          {demand?.interview}
        </Descriptions.Item>
        <Descriptions.Item label="录入">{demand?.entryName}</Descriptions.Item>
        <Descriptions.Item label="处理人">{demand?.hrName}</Descriptions.Item>
        <Descriptions.Item label="状态">
          {demand && status_hash[demand?.status]}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {demand?.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="描述">
          {demand?.description}
        </Descriptions.Item>
      </Descriptions>
      <div>
        {demand?.status === 2 && task === '2' ? (
          <Link
            to={`/talent/recruit/search/${demand?.demandId}`}
            style={{ marginRight: 20 }}
          >
            <Button type="primary"> 搜索简历</Button>
          </Link>
        ) : null}
        {demand?.status === 1 ? (
          <>
            <Link
              to={`/talent/recruit/edit/${demandId}`}
              style={{ marginRight: 20 }}
            >
              <Button> 编辑</Button>
            </Link>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
              onClick={showModal}
            >
              {' '}
              分配
            </Button>
            <Button
              type="primary"
              danger
              style={{ marginRight: 20 }}
              onClick={removeDemand}
            >
              {' '}
              删除
            </Button>
          </>
        ) : null}
        <Button onClick={e => history.goBack()}> 返回</Button>
      </div>
      <Modal
        visible={visible}
        title="分配"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} onFinish={handleSetHr}>
          <Form.Item
            label="指派给"
            name="hrCode"
            rules={[{ required: true, message: '请选择HR' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="请选择HR"
            >
              {roleList?.map((item, i) => {
                return (
                  <Select.Option key={i} value={item.userCode}>
                    {item.userName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
