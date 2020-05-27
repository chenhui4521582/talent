import React, { useState } from 'react';
import {
  Card, Form, Select, Row, Col, Input, Divider, Modal, notification
} from 'antd';
import { Link } from 'umi';
import { useTable } from '@/components/GlobalTable/useTable';
import { listInterviewByInterviewer, updateInterviewByInterviewer } from './services/myview';
import { ColumnProps } from 'antd/es/table';
import { useRank } from '@/models/global';
import { GlobalResParams, formItemLayout } from '@/types/ITypes';

const { Option } = Select;
const { TextArea } = Input;
export default () => {
  const [curRecord, setCurRecord] = useState<any>();
  const [form] = Form.useForm();
  const [view, setView] = useState<number>(-1);
  const { rankList } = useRank();
  const columns: ColumnProps<any>[] = [
    {
      title: '编号',
      dataIndex: 'resumeId',
      key: 'resumeId',
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
      title: '职级',
      key: 'rank',
      dataIndex: 'rank',
      align: 'center'
    },
    {
      title: '应聘人',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '面试时间',
      key: 'interviewTime',
      dataIndex: 'interviewTime',
      align: 'center',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (text) => {
        const data = { 0: '面试不通过', 1: '待沟通', 2: '待面试', 3: '待录用', 4: '已录用', 5: '拒绝面试', 6: '已入职', 7: '未入职', 11: '确认入职' };
        return <span>{data[text]}</span>
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        if (record.status === 2) {
          return(
            <span>
              <Link to={`/talent/Resume/Cvdetails?resumeId=${record.resumeId}&resumeStatus=${record.status}`}> 查看简历</Link>
              <Divider type="vertical" />
              <a onClick={e => showModal(record)}> 填写反馈</a>
            </span>
          )
        } else {
          return(
            <span>
              <Link to={`/talent/Resume/Cvdetails?resumeId=${record.resumeId}&resumeStatus=${record.status}`}> 查看简历</Link>
            </span>
          )
        }
      }
    }
  ];
  const { TableContent, refresh } = useTable({
    queryMethod: listInterviewByInterviewer,
    columns,
    rowKeyName: 'resumeId'
  });

  const showModal = (record) => {
    setCurRecord(record);
  };

  const cancelModal = () => {
    setCurRecord(undefined);
    form.resetFields();
    setView(-1);
  };

  const changeView = (value) => {
    setView(value);
  };

  const handleSubmit = async (values) => {
    values.nId = curRecord.nId;
    values.resumeId = curRecord.resumeId;
    let res: GlobalResParams<string> = await updateInterviewByInterviewer(values);
    if(res.status === 200) {
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
    <Card title="我的需求">
      <TableContent>
        <Row>
          <Col span={6}>
            <Form.Item
              label="编号"
              name="resumeId"
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
          <Col span={6} offset={2}>
            <Form.Item
              label="状态"
              name="status"
            >
              <Select
                allowClear={true}
              >
                <Option value={0}>不通过</Option>
                <Option value={2}>待面试</Option>
                <Option value={3}>待录用</Option>
                <Option value={4}>已录用</Option>
                <Option value={5}>未面试</Option>
                <Option value={11}>确认入职</Option>
                <Option value={6}>已入职</Option>
                <Option value={7}>未入职</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        visible={!!curRecord}
        title="填写反馈"
        onOk={e => form.submit()}
        onCancel={cancelModal}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          {...formItemLayout}
        >
          <Form.Item
            label='面试情况'
            name="interviewFlag"
            rules={[{ required: true, message: '请选择面试情况' }]}
          >
            <Select placeholder="请选择面试情况" onChange={changeView}>
              <Option key={0} value={0}> 未参加面试</Option>
              <Option key={1} value={1}> 参加面试</Option>
            </Select>
          </Form.Item>
          {
            view === 1 &&
            <>
              <Form.Item
                label='是否录用'
                name="status"
                rules={[{ required: true, message: '请选择是否录用' }]}
              >
                <Select placeholder="请选择是否录用">
                  <Option key={0} value={0}> 不录用</Option>
                  <Option key={3} value={3}> 录用</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label='职级'
                name="rankId"
                rules={[{ required: true, message: '请选择实际职级' }]}
              >
                <Select showSearch placeholder="请选择实际职级">
                  {
                    rankList?.map(item => {
                      return <Option key={item.rankId} value={item.rankId}>{item.rankName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item
                label='反馈意见'
                name="evaluation"
                rules={[{ required: true, message: '请填写反馈意见' }]}
              >
                <TextArea rows={8} placeholder='请填写反馈意见' />
              </Form.Item>
              <p> 反馈内容：</p>
              <p>1. 面试内容+面试评价（满分10分，6分合格）</p>
              <p>2. 优势&劣势 是哪些？</p>
              <p>3. offer信息(若录取) 入职部门，入职职位名称，汇报对象</p>
              <p>4. 试用期考核指标主要哪些？</p>
            </>
          }
        </Form>
      </Modal>
    </Card>
  )
}