import React from 'react';
import { useTabTable } from '@/components/GlobalTable/useTabTable';
import { queryDemandResume, sendResume } from '../services/resume';
import { Link } from 'umi';
import {
  Card,
  Divider,
  notification,
  Form,
  Row,
  Col,
  Input,
  Modal,
} from 'antd';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';

export default props => {
  const { demandId } = props;
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'jobLabel',
      key: 'jobLabel',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'pushStatus',
      key: 'pushStatus',
      align: 'center',
      render: text => {
        const data = { 0: '未推送', 1: '已推送' };
        return <span>{data[text]}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link
              to={`/talent/resume/print?resumeId=${record.resumeId}&resumeStatus=${record.status}`}
            >
              查看简历
            </Link>
            <Divider type="vertical" />
            {record.pushStatus === 0 ? (
              <a
                onClick={e => handleSendResume(record.status, record.resumeId)}
              >
                推送
              </a>
            ) : (
              <span>已推送</span>
            )}
          </span>
        );
      },
    },
  ];
  const { TableContent, refresh } = useTabTable({
    queryMethod: queryDemandResume,
    columns,
    paramName: 'resumeStatus',
    defaultValue: '2',
    tabData: [
      {
        name: '已下载简历',
        value: '2',
      },
      {
        name: '未下载简历',
        value: '1',
      },
    ],
    rowKeyName: 'resumeId',
    cacheKey: 'resume/listMyDemandResume',
  });
  const handleSendResume = async (downStatus: number, resumeIds: string) => {
    Modal.confirm({
      title: '你确定推送此简历吗?',
      okText: '确定',
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await sendResume({
          downStatus,
          resumeIds,
          demandId,
        });
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
    <Card title="待推送简历">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
    </Card>
  );
};
