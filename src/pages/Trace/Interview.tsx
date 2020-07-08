import React from 'react';
import { Link } from 'umi';
import { Card, Form, Row, Col, notification, Modal, Input } from 'antd';
import { useTable } from '@/components/GlobalTable/useTable';
import { ColumnProps } from 'antd/es/table';
import { querySmsReocrd, resendSms } from './services/trace';
import { GlobalResParams } from '@/types/ITypes';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default () => {
  const columns: ColumnProps<any>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '短信内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
    },
    {
      title: '关联需求',
      dataIndex: 'demandId',
      key: 'demandId',
      align: 'center',
      render: text => {
        return <Link to={`/talent/recruit/show/${text}?task=2`}>需求</Link>;
      },
    },
    {
      title: 'HR',
      dataIndex: 'hrName',
      key: 'hrName',
      align: 'center',
    },
    {
      title: '面试时间',
      dataIndex: 'interviewTime',
      key: 'interviewTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return <a onClick={e => handleResend(record.id)}>重新发送</a>;
      },
    },
  ];

  const { TableContent, refresh } = useTable({
    queryMethod: querySmsReocrd,
    columns,
    rowKeyName: 'id',
    paramName: 'type',
    paramValue: 1,
    cacheKey: 'record/listSmsRecord',
  });

  const handleResend = async (id: number) => {
    Modal.confirm({
      title: '你确定要重新发送短信吗?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await resendSms({ id, type: 1 });
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
    <Card title="面试通知列表">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="姓名" name="name">
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
