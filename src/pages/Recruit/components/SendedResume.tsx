import React, { useState } from 'react';
import { useTable } from '@/components/GlobalTable/useTable';
import {
  querySendedResume,
  refuseEva,
  setInterview,
  revoke,
} from '../services/resume';
import {
  Card,
  Divider,
  notification,
  Modal,
  DatePicker,
  Form,
  Tooltip,
  Row,
  Col,
  Input,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { Link, history } from 'umi';
import { GlobalResParams } from '@/types/ITypes';

export default props => {
  const [visible, setVisible] = useState<boolean>(false);
  const [curRecord, setCurRecord] = useState<any>();
  const [form] = Form.useForm();
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'center',
    },
    {
      title: '筛选结果',
      dataIndex: 'pushStatus',
      key: 'pushStatus',
      align: 'center',
      render: (text, record) => {
        if (text === 9) {
          return (
            <div>
              <span style={{ color: 'red' }}> 已驳回</span>
              <Tooltip title={record.rejectReason}>
                <span>查看理由</span>
              </Tooltip>
            </div>
          );
        } else if (text === 8) {
          return <span> 未处理</span>;
        } else {
          return <span> 已通过</span>;
        }
      },
    },
    {
      title: '处理时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        if (record.pushStatus === 1) {
          return (
            <span>
              <Link
                to={`/talent/resume/cvdetails?resumeId=${record.resumeId}&resumeStatus=${record.downStatus}`}
              >
                查看简历
              </Link>
              <Divider type="vertical" />
              <a onClick={e => showModal(record)}> 发起面试</a>
              <Divider type="vertical" />
              <a onClick={e => handleRefuse(record.nId)}>放弃面试</a>
            </span>
          );
        } else if (record.pushStatus === 2) {
          return (
            <a
              onClick={() => {
                onRevoke(record.nId);
              }}
            >
              {' '}
              撤回
            </a>
          );
        } else if (record.pushStatus === 10) {
          return <span style={{ color: 'red' }}> 放弃面试</span>;
        } else {
          return null;
        }
      },
    },
  ];
  const { TableContent, refresh } = useTable({
    queryMethod: querySendedResume,
    columns,
    rowKeyName: 'resumeId',
    cacheKey: 'evaluation/listEvaluationByHr',
  });

  const onRevoke = demandId => {
    Modal.confirm({
      title: '你确定要撤回此简历吗?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await revoke(demandId);
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
  const handleRefuse = async (nId: number) => {
    Modal.confirm({
      title: '你确定此人放弃面试吗?',
      okText: '确定',
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await refuseEva(nId);
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

  const showModal = record => {
    setCurRecord(record);
    setVisible(true);
  };

  const cancelModal = () => {
    setCurRecord(undefined);
    setVisible(false);
    form.resetFields();
  };

  const handleSetTime = async values => {
    values.nId = curRecord.nId;
    values.interviewTime = values.interviewTime.format('YYYY-MM-DD HH:mm:ss');
    let res: GlobalResParams<string> = await setInterview(values);
    if (res.status === 200) {
      refresh();
      cancelModal();
      notification['success']({
        message: res.msg,
        description: '',
      });
    } else if (res.status === 2001) {
      history.push(
        `/talent/resume/cvupload?undownResumeId=${curRecord.resumeId}&jobId=${curRecord.positionId}`,
      );
      notification['error']({
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
    <Card title="未下载简历">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={visible}
        title="发起面试"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} onFinish={handleSetTime}>
          <Form.Item
            label="面试时间"
            name="interviewTime"
            rules={[{ required: true, message: '请选择面试时间' }]}
          >
            <DatePicker showTime placeholder="请选择面试时间" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
