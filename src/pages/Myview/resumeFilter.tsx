import React, { useState } from 'react';
import { Card, Tooltip, Divider, Modal, notification, Form, Input } from 'antd';
import { Link } from 'umi';
import { useTab } from './components/useTab';
import { listEvaByInterviewer, updateEvaluation } from './services/myview';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';

const { TextArea } = Input;
export default () => {
  const [curRecord, setCurRecord] = useState<any>();
  const [form] = Form.useForm();
  const screeningColumns: ColumnProps<any>[] = [
    {
      title: '简历编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '岗位',
      key: 'jobName',
      dataIndex: 'jobName',
      align: 'center'
    },
    {
      title: '职级',
      key: 'rank',
      dataIndex: 'rank',
      align: 'center'
    },
    {
      title: '推送时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <span>
          <Link to={`/talent/Resume/Cvdetails?resumeId=${record.resumeId}&resumeStatus=${record.downStatus}`}>查看</Link>
          <Divider type="vertical" />
          <a onClick={e => handlePass(record)}>通过</a>
          <Divider type="vertical" />
          <a onClick= { e => showModal(record)}>驳回</a>
        </span>
      ),
    }
  ];

  const screenedColumns: ColumnProps<any>[] = [
    {
      title: '简历编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '岗位',
      key: 'jobName',
      dataIndex: 'jobName',
      align: 'center'
    },
    {
      title: '职级',
      key: 'rank',
      dataIndex: 'rank',
      align: 'center'
    },
    {
      title: '筛选结果',
      key: 'pushStatus',
      dataIndex: 'pushStatus',
      align: 'center',
      render: (_, record) => {
        if (record.pushStatus === 9) {
          return(
            <>
              <span style={{color: 'red'}}> 驳回</span>
              <Tooltip title={record.rejectReason}>
                <a> 查看理由</a>
              </Tooltip>
            </>
          )
        } else {
          return(
            <span> 通过</span>
          )
        }
      }
    },
    {
      title: '推送时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center'
    },
  ];
  const { TableContent, refresh } = useTab({
    queryMethod: listEvaByInterviewer,
    paramName: 'deal',
    defaultValue: '0',
    tabData: [{
      name: '待筛选简历',
      value: '0',
      columns: screeningColumns
    }, {
      name: '已筛选简历',
      value: '1',
      columns: screenedColumns
    }],
    rowKeyName: 'nId'
  });

  const handlePass = (record) => {
    Modal.confirm({
      title: '您确定通过此简历吗?',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk: async () => {
        let res: GlobalResParams<string> = await updateEvaluation({
          nId: record.nId,
          resumeId: record.resumeId,
          status: 1,
          interviewFlag: record.downStatus
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
      }
    });
  };

  const showModal = (record) => {
    setCurRecord(record);
  };

  const cancelModal = () => {
    setCurRecord(undefined);
    form.resetFields();
  };

  const handleRefuse = async (values) => {
    let res: GlobalResParams<string> = await updateEvaluation({
      nId: curRecord.nId,
      resumeId: curRecord.resumeId,
      status: 0,
      interviewFlag: curRecord.downStatus,
      ...values
    });
    if (res.status === 200) {
      refresh();
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
  }
  return (
    <Card title="简历筛选">
      <TableContent />
      <Modal
        visible={!!curRecord}
        title="填写驳回理由"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          onFinish={handleRefuse}
        >
          <Form.Item
            label='驳回理由'
            name="evaluation"
            rules={[{ required: true, message: '请填写驳回理由' }]}
          >
            <TextArea rows={8} placeholder="请填写驳回理由" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}